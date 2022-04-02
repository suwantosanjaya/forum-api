/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'sebuah comment',
        threadId: 'thread-1234',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-1234');
      expect(comments).toHaveLength(1);
      expect(addedComment).toEqual({
        id: comments[0].id,
        content: comments[0].content,
        owner: comments[0].owner,
      });
    });
  });

  describe('getCommentById function', () => {
    it('should throw error when not found', async () => {
      // Arrange
      const fakeCommentId = 'fake-comment-id';
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById(fakeCommentId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment', async () => {
      const comment = await CommentsTableTestHelper.addComment({});
      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-1234'),
      ).resolves.toEqual(
        {
          id: comment.id,
          content: comment.content,
          thread_id: comment.thread_id,
          date: comment.date,
          owner: comment.owner,
          is_delete: false,
        },
      );
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should throw error when not found', async () => {
      // Arrange
      const fakeThreadId = 'fake-thread-id';
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentsByThreadId(fakeThreadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comments', async () => {
      await CommentsTableTestHelper.addComment({});
      const threadId = 'thread-1234';
      const comments = await CommentsTableTestHelper.findCommentsByThreadId(threadId);

      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentsByThreadId(threadId),
      ).resolves.toEqual(
        {
          id: comments[0].id,
          content: comments[0].content,
          thread_id: comments[0].thread_id,
          date: comments[0].date,
          owner: comments[0].owner,
          is_delete: comments[0].is_delete,
        },
      );
    });
  });

  describe('getCommentsDetailByThreadId function', () => {
    it('should return empty object when not found', async () => {
      // Arrange
      const fakeThreadId = 'fake-thread-id';
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentsDetailByThreadId(fakeThreadId),
      ).resolves.toEqual([]);
    });

    it('should return comments', async () => {
      await CommentsTableTestHelper.addComment({});
      const threadId = 'thread-1234';
      const comments = await CommentsTableTestHelper.findCommentsDetailByThreadId(threadId);

      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentsDetailByThreadId(threadId),
      ).resolves.toEqual(
        [
          {
            id: comments[0].id,
            content: comments[0].content,
            date: comments[0].date,
            username: comments[0].username,
            is_delete: comments[0].is_delete,
          },
        ],
      );
    });
  });

  describe('deleteComment function', () => {
    it('should throw error when not found', async () => {
      // Arrange
      const fakeCommentId = 'fake-comment-id';
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment(fakeCommentId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comments', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-1234';

      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment(commentId),
      ).resolves.toEqual(
        {
          is_delete: true,
        },
      );
    });
  });

  describe('verifyOwner function', () => {
    it('should throw AuthorizationError when ownerId not found', async () => {
      await CommentsTableTestHelper.addComment({});
      // Arrange
      const fakeOwnerId = 'fake-user';
      const commentId = 'comment-1234';
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyOwner(commentId, fakeOwnerId),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should return ownerId when commentId and ownerId is valid', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-1234';
      const ownerId = 'user-123';

      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyOwner(commentId, ownerId),
      ).resolves.toEqual(
        {
          owner: ownerId,
        },
      );
    });
  });
});
