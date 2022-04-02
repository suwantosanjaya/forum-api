/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false,
    },
  });

  pgm.addConstraint(
    'comments',
    'fk_comments_threads',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comments',
    'fk_comments_users',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments_threads');
  pgm.dropConstraint('comments', 'fk_comments_users');
  pgm.dropTable('comments');
};
