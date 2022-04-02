const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-1234',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-1234',
        content: 'sebuah comment',
        threadId: 'thread-1234',
        owner: 'user-123',
        date: new Date().toISOString(),
        is_delete: false,
      }));
    mockCommentRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve([{ owner: 'user-123' }]));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve([{ is_delete: true }]));

    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(deletedComment).toStrictEqual([{ is_delete: true }]);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});
