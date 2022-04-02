/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-1234',
    content = 'sebuah comment',
    threadId = 'thread-1234',
    owner = 'user-123',
    date = new Date().toISOString(),
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, content, threadId, owner, date, isDelete],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsDetailByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
              FROM comments c INNER JOIN users u ON (c.owner = u.id) 
              WHERE c.thread_id = $1`,
      values: [threadId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async removeCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING is_delete',
      values: [commentId],
    };

    const result = await pool.query(query);
    return { ...result.rows[0] };
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;
