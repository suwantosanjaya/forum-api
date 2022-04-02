const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this.container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this.container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(
      {
        ...request.payload,
        owner: request.auth.credentials.id,
      },
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this.container.getInstance(GetThreadUseCase.name);

    const thread = await getThreadUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
