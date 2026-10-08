export function createResponse() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    headersSent: false,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(body) {
      this.body = body;
      return this;
    },

    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },

    sendStatus(code) {
      this.statusCode = code;
      return this;
    },
  };
}

export function createRequest({ body = {}, ip = '203.0.113.10', headers = {} } = {}) {
  const resolvedHeaders = new Map(
    Object.entries({
      host: 'pasport-bezopasnosty.ru',
      'user-agent': 'Mozilla/5.0 Test Browser',
      ...headers,
    }).map(([name, value]) => [name.toLowerCase(), value]),
  );

  return {
    ip,

    socket: {
      remoteAddress: ip,
    },

    body,

    get(name) {
      return resolvedHeaders.get(String(name).toLowerCase());
    },
  };
}

export async function withMutedConsole(method, action) {
  const original = console[method];

  console[method] = () => {};

  try {
    return await action();
  } finally {
    console[method] = original;
  }
}
