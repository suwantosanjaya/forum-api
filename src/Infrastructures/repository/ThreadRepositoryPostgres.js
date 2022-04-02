// const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const {
      title, body, owner,
    } = newThread;
    const id = `thread-${this.idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this.pool.query(query);

    return { ...result.rows[0] };
  }

  async verifyThreadAvailbility(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('data tidak ditemukan');
    }

    return result.rows[0];
  }

  async getThreadDetailById(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username 
              FROM threads t INNER JOIN users u ON (t.owner = u.id) 
              WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('data tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
