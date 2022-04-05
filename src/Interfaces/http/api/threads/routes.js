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
    path: '/threads/{threadId}',
    handler: () => ({
      value: 'Hello Dicoding!',
    }),
  },
]);

module.exports = routes;
