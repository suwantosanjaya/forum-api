/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-1234');
      expect(threads).toHaveLength(1);
      expect(addedThread.id).toStrictEqual(threads[0].id);
      expect(addedThread.title).toStrictEqual(threads[0].title);
      expect(addedThread.owner).toStrictEqual(threads[0].owner);
    });
  });
  describe('verifyThreadAvailbility function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const fakeThreadId = 'fake-thread-id';
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailbility(fakeThreadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread', async () => {
      const thread = await ThreadsTableTestHelper.addThread({});
      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailbility('thread-12345'),
      ).resolves.toEqual(
        {
          id: thread.id,
          title: thread.title,
          body: thread.body,
          date: thread.date,
          owner: thread.owner,
        },
      );
    });
  });
  describe('getThreadDetailById function', () => {
    it('should throw error when not found', async () => {
      // Arrange
      const fakeThreadId = 'fake-thread-id';
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadDetailById(fakeThreadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread detail', async () => {
      const payload = {
        id: 'thread-1234',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        date: new Date().toISOString(),
        owner: 'user-123',
      };
      const thread = await ThreadsTableTestHelper.addThread(payload);
      const user = await UsersTableTestHelper.findUsersById(payload.owner);
      // Arrange
      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadDetailById('thread-1234'),
      ).resolves.toEqual(
        {
          id: thread.id,
          title: thread.title,
          body: thread.body,
          date: thread.date,
          username: user[0].username,
        },
      );
    });
  });
});
