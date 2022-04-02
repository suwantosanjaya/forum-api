const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const {
      content, threadId, owner,
    } = newComment;
    const id = `comment-${this.idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date, false],
    };

    const result = await this.pool.query(query);

    return { ...result.rows[0] };
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('data tidak ditemukan');
    }

    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('data tidak ditemukan');
    }

    return result.rows[0];
  }

  async getCommentsDetailByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
              FROM comments c INNER JOIN users u ON (c.owner = u.id)
              WHERE c.thread_id = $1`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return [...result.rows];
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING is_delete',
      values: [commentId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('data tidak ditemukan');
    }
    return { ...result.rows[0] };
  }

  async verifyOwner(commentId, ownerId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this.pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk data tersebut');
    }
    return { ...result.rows[0] };
  }
}

module.exports = CommentRepositoryPostgres;
