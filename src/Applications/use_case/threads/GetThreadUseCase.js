/* eslint-disable class-methods-use-this */
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this.threadRepository.verifyThreadAvailbility(useCasePayload.threadId);
    const thread = await this.threadRepository.getThreadDetailById(useCasePayload.threadId);
    let comments = await this.commentRepository
      .getCommentsDetailByThreadId(useCasePayload.threadId);
    comments = comments.map((comment) => this.commentStandardize(comment));

    return {
      ...thread,
      comments,
    };
  }

  commentStandardize(comment) {
    const originalComment = {
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
    };
    if (comment.is_delete) {
      return {
        ...originalComment,
        content: '**komentar telah dihapus**',
      };
    }

    return originalComment;
  }
}

module.exports = GetThreadUseCase;
