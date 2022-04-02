const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this.threadRepository.verifyThreadAvailbility(newComment.threadId); // Cek thread
    const addedComment = await this.commentRepository.addComment(newComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
