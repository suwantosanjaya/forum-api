const NewComment = require('../../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
// const AddThreadUseCase = require('../../threads/AddThreadUseCase');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      threadId: 'thread-1234',
      owner: 'user-123',
    };
    const expectedComment = {
      id: 'comment-1234',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailbility = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-1234',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        date: new Date().toISOString(),
        owner: 'user-123',
      }));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedComment);
    expect(mockThreadRepository.verifyThreadAvailbility).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
