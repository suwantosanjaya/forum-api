class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this.commentRepository.getCommentById(useCasePayload.commentId);
    await this.commentRepository.verifyOwner(useCasePayload.commentId, useCasePayload.owner);
    const deleteComment = await this.commentRepository.deleteComment(useCasePayload.commentId);
    return deleteComment;
  }
}

module.exports = DeleteCommentUseCase;
