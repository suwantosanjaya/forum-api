const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly when there is not a comment', async () => {
    // Arrange
    const threadId = 'thread-1234';
    const thread = {
      id: threadId,
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date().toISOString(),
      username: 'dicoding',
    };

    const expectedThread = {
      ...thread,
      comments: [],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailbility = jest.fn()
      .mockImplementation(() => Promise.resolve(threadId));

    mockThreadRepository.getThreadDetailById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsDetailByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadResult = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(threadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadAvailbility).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsDetailByThreadId).toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread action correctly when there is a comment', async () => {
    // Arrange
    const comment = {
      id: 'comment-1234',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'sebuah comment',
    };

    const threadId = 'thread-1234';
    const thread = {
      id: threadId,
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date().toISOString(),
      username: 'dicoding',
    };

    const expectedThread = {
      ...thread,
      comments: [{ ...comment }],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailbility = jest.fn()
      .mockImplementation(() => Promise.resolve(threadId));

    mockThreadRepository.getThreadDetailById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsDetailByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{ ...comment, is_delete: false }]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadResult = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(threadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadAvailbility).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsDetailByThreadId).toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread action correctly when there is deleted comment', async () => {
    // Arrange
    const comment = {
      id: 'comment-1234',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: '**komentar telah dihapus**',
    };

    const threadId = 'thread-1234';
    const thread = {
      id: threadId,
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date().toISOString(),
      username: 'dicoding',
    };

    const expectedThread = {
      ...thread,
      comments: [{ ...comment }],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailbility = jest.fn()
      .mockImplementation(() => Promise.resolve(threadId));

    mockThreadRepository.getThreadDetailById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsDetailByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{ ...comment, is_delete: true }]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadResult = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(threadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadAvailbility).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsDetailByThreadId).toBeCalledWith(threadId);
  });

  describe('commentStandardize function', () => {
    it('should return **komentar telah dihapus** comment if is_delete true', async () => {
      // Arrange
      const comment = {
        id: 'comment-1234',
        username: 'dicoding',
        date: new Date().toISOString(),
        content: 'sebuah comment',
        is_delete: true,
      };

      const expectedComment = {
        id: 'comment-1234',
        username: 'dicoding',
        date: new Date().toISOString(),
        content: '**komentar telah dihapus**',
      };

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** creating use case instance */
      const getThreadUseCase = new GetThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const commentStandard = getThreadUseCase.commentStandardize(comment);

      // Assert
      expect(expectedComment).toEqual(commentStandard);
    });
  });
});
