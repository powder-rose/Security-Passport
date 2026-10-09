import process from 'node:process';

export const DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS = 25_000;

export function resolveGracefulShutdownTimeout(
  value,
  fallback = DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS,
) {
  const timeout = Number(value);

  if (!Number.isFinite(timeout) || timeout <= 0) {
    return fallback;
  }

  return Math.floor(timeout);
}

export function registerGracefulShutdown({
  server,
  processRef = process,
  timeoutMs = DEFAULT_GRACEFUL_SHUTDOWN_TIMEOUT_MS,
  logger = console,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
}) {
  const resolvedTimeoutMs = resolveGracefulShutdownTimeout(timeoutMs);

  let shutdownPromise = null;
  let timeout = null;
  let forced = false;
  let finished = false;

  function removeSignalHandlers() {
    const removeListener =
      typeof processRef.off === 'function'
        ? processRef.off.bind(processRef)
        : processRef.removeListener.bind(processRef);

    removeListener('SIGINT', handleSigint);
    removeListener('SIGTERM', handleSigterm);
  }

  function forceShutdown(reason) {
    if (forced || finished) {
      return;
    }

    forced = true;
    processRef.exitCode = 1;

    logger.warn(`[server] forcing shutdown: ${reason}`);

    server.closeAllConnections?.();
  }

  function shutdown(signal = 'shutdown') {
    if (shutdownPromise) {
      forceShutdown(`received ${signal} while shutdown is already in progress`);

      return shutdownPromise;
    }

    logger.log(`[server] graceful shutdown started: ${signal}`);

    shutdownPromise = new Promise(resolve => {
      timeout = setTimeoutFn(() => {
        forceShutdown(`timeout after ${resolvedTimeoutMs}ms`);
      }, resolvedTimeoutMs);

      timeout?.unref?.();

      function complete(error) {
        if (timeout) {
          clearTimeoutFn(timeout);
          timeout = null;
        }

        if (error) {
          logger.error('[server] graceful shutdown failed:', error);

          forceShutdown('HTTP server close failed');
        }

        if (!forced) {
          processRef.exitCode = 0;

          logger.log('[server] graceful shutdown completed');
        }

        finished = true;
        removeSignalHandlers();

        resolve({
          signal,
          forced,
          error: error || null,
        });
      }

      try {
        /*
         * server.close() прекращает приём новых
         * соединений и ждёт завершения активных
         * HTTP-запросов.
         */
        server.close(complete);

        /*
         * Keep-alive соединения без активного
         * запроса можно закрыть сразу.
         */
        server.closeIdleConnections?.();
      } catch (error) {
        complete(error);
      }
    });

    return shutdownPromise;
  }

  function handleSigint() {
    void shutdown('SIGINT');
  }

  function handleSigterm() {
    void shutdown('SIGTERM');
  }

  processRef.on('SIGINT', handleSigint);
  processRef.on('SIGTERM', handleSigterm);

  return {
    shutdown,

    dispose() {
      if (!finished) {
        removeSignalHandlers();
      }
    },
  };
}
