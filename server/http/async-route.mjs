export function asyncRoute(handler) {
  return function wrappedAsyncRoute(request, response, next) {
    return Promise.resolve()
      .then(() => handler(request, response, next))
      .catch(next);
  };
}
