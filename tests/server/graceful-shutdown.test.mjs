import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs/promises';
import http from 'node:http';
import { createRequire } from 'node:module';
import test from 'node:test';

import {
  DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS,
  registerGracefulShutdown,
  resolveGracefulShutdownTimeout,
} from '../../server/http/graceful-shutdown.mjs';

const require = createRequire(import.meta.url);

function createProcess() {
  const processRef = new EventEmitter();

  processRef.exitCode = undefined;

  return processRef;
}

function createServer() {
  let closeCallback = null;

  return {
    closeCalls: 0,
    closeIdleConnectionsCalls: 0,
    closeAllConnectionsCalls: 0,

    close(callback) {
      this.closeCalls += 1;
      closeCallback = callback;

      return this;
    },

    closeIdleConnections() {
      this.closeIdleConnectionsCalls += 1;
    },

    closeAllConnections() {
      this.closeAllConnectionsCalls += 1;
    },

    completeClose(error) {
      assert.equal(typeof closeCallback, 'function', 'server.close callback must be registered');

      closeCallback(error);
    },
  };
}

function createTimers() {
  const timers = [];

  function setTimeoutFn(callback, delay) {
    const timer = {
      callback,
      delay,
      cleared: false,
      unrefCalled: false,

      unref() {
        this.unrefCalled = true;

        return this;
      },
    };

    timers.push(timer);

    return timer;
  }

  function clearTimeoutFn(timer) {
    timer.cleared = true;
  }

  return {
    timers,
    setTimeoutFn,
    clearTimeoutFn,
  };
}

function createLogger() {
  return {
    logs: [],
    warnings: [],
    errors: [],

    log(...args) {
      this.logs.push(args);
    },

    warn(...args) {
      this.warnings.push(args);
    },

    error(...args) {
      this.errors.push(args);
    },
  };
}

function createHarness({ timeoutMs = DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS } = {}) {
  const server = createServer();
  const processRef = createProcess();
  const timers = createTimers();
  const logger = createLogger();

  const lifecycle = registerGracefulShutdown({
    server,
    processRef,
    timeoutMs,
    logger,
    setTimeoutFn: timers.setTimeoutFn,
    clearTimeoutFn: timers.clearTimeoutFn,
  });

  return {
    server,
    processRef,
    timers,
    logger,
    lifecycle,
  };
}

test('graceful shutdown registers SIGINT and SIGTERM and starts HTTP draining', () => {
  const { server, processRef, timers } = createHarness({
    timeoutMs: 25_000,
  });

  assert.equal(processRef.listenerCount('SIGINT'), 1);

  assert.equal(processRef.listenerCount('SIGTERM'), 1);

  processRef.emit('SIGTERM');

  assert.equal(server.closeCalls, 1);

  assert.equal(server.closeIdleConnectionsCalls, 1);

  assert.equal(server.closeAllConnectionsCalls, 0);

  assert.equal(timers.timers.length, 1);

  assert.equal(timers.timers[0].delay, 25_000);

  assert.equal(timers.timers[0].unrefCalled, true);

  assert.equal(
    processRef.exitCode,
    undefined,
    'Process must stay alive while active requests are draining',
  );
});

test('graceful shutdown completes with exit code 0 after HTTP server closes', async () => {
  const { server, processRef, timers, lifecycle } = createHarness();

  const shutdown = lifecycle.shutdown('SIGTERM');

  assert.equal(server.closeCalls, 1);

  server.completeClose();

  await shutdown;

  assert.equal(timers.timers[0].cleared, true);

  assert.equal(processRef.exitCode, 0);

  assert.equal(server.closeAllConnectionsCalls, 0);
});

test('graceful shutdown force-closes active connections after timeout', async () => {
  const { server, processRef, timers, lifecycle } = createHarness({
    timeoutMs: 25_000,
  });

  const shutdown = lifecycle.shutdown('SIGTERM');

  timers.timers[0].callback();

  assert.equal(server.closeAllConnectionsCalls, 1);

  assert.equal(processRef.exitCode, 1);

  server.completeClose();

  await shutdown;

  assert.equal(processRef.exitCode, 1, 'A forced shutdown must not be converted back to success');
});

test('a second shutdown signal forces the existing shutdown immediately', async () => {
  const { server, processRef, lifecycle } = createHarness();

  const shutdown = lifecycle.shutdown('SIGTERM');

  processRef.emit('SIGINT');

  assert.equal(server.closeCalls, 1, 'Repeated signals must not call server.close twice');

  assert.equal(server.closeAllConnectionsCalls, 1);

  assert.equal(processRef.exitCode, 1);

  server.completeClose();

  await shutdown;
});

test('server close failure marks shutdown as failed and force-closes connections', async () => {
  const { server, processRef, lifecycle } = createHarness();

  const shutdown = lifecycle.shutdown('SIGTERM');

  server.completeClose(new Error('close failed'));

  await shutdown;

  assert.equal(server.closeAllConnectionsCalls, 1);

  assert.equal(processRef.exitCode, 1);
});

test('graceful shutdown timeout parsing accepts only positive finite integers', () => {
  assert.equal(resolveGracefulShutdownTimeout('12000'), 12_000);

  assert.equal(resolveGracefulShutdownTimeout('12000.9'), 12_000);

  for (const value of ['', '0', '-1', 'invalid', Infinity, null, undefined]) {
    assert.equal(resolveGracefulShutdownTimeout(value), DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS);
  }
});

test('PM2 kill timeout is longer than the application graceful shutdown window', () => {
  const config = require('../../deploy/pm2/ecosystem.config.cjs');

  const passportApi = config.apps.find(app => app.name === 'passport-api');

  assert.ok(passportApi, 'passport-api PM2 configuration must exist');

  assert.ok(
    Number(passportApi.kill_timeout) > DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS,
    'PM2 must allow the application to finish its own graceful timeout before SIGKILL',
  );
});

test('server entrypoint registers graceful shutdown for the listening HTTP server', async () => {
  const source = await fs.readFile(new URL('../../server/index.mjs', import.meta.url), 'utf8');

  assert.match(source, /const server = app\.listen\(/);

  assert.match(source, /registerGracefulShutdown\(\{\s*server,/);

  assert.match(source, /GRACEFUL_SHUTDOWN_TIMEOUT_MS/);
});

test('graceful shutdown lets an active real HTTP request finish', async () => {
  let requestStartedResolve;
  let releaseRequestResolve;

  const requestStarted = new Promise(resolve => {
    requestStartedResolve = resolve;
  });

  const releaseRequest = new Promise(resolve => {
    releaseRequestResolve = resolve;
  });

  const server = http.createServer(async (_request, response) => {
    requestStartedResolve();

    await releaseRequest;

    response.statusCode = 200;
    response.end('completed');
  });

  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);

      server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();

    assert.ok(address && typeof address === 'object');

    const processRef = createProcess();
    const logger = createLogger();

    const lifecycle = registerGracefulShutdown({
      server,
      processRef,
      timeoutMs: 5_000,
      logger,
    });

    const responsePromise = fetch(`http://127.0.0.1:${address.port}/`);

    await requestStarted;

    const shutdown = lifecycle.shutdown('SIGTERM');

    /*
     * Active request is deliberately still blocked.
     * Shutdown must wait instead of destroying it.
     */
    assert.equal(processRef.exitCode, undefined);

    releaseRequestResolve();

    const response = await responsePromise;

    assert.equal(response.status, 200);

    assert.equal(await response.text(), 'completed');

    await shutdown;

    assert.equal(processRef.exitCode, 0);

    assert.equal(server.listening, false);
  } finally {
    releaseRequestResolve?.();

    server.closeAllConnections?.();

    if (server.listening) {
      await new Promise(resolve => {
        server.close(resolve);
      });
    }
  }
});
