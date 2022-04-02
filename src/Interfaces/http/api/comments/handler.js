const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this.container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const addCommentUseCase = this.container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(
      {
        ...request.payload,
        threadId,
        owner: request.auth.credentials.id,
      },
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201); // Created
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { commentId } = request.params;
    const deleteCommentUseCase = this.container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(
      {
        commentId,
        owner: request.auth.credentials.id,
      },
    );

    const response = h.response({
      status: 'success',
    });
    response.code(200); // Everything is OK
    return response;
  }
}

module.exports = CommentsHandler;
