const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadHandler,
  },
  {
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Hello Dicoding, My name is Suwanto Sanjaya',
    }),
  },

]);

module.exports = routes;
