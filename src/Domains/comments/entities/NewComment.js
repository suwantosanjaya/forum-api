class NewComment {
  constructor(payload) {
    const {
      content, threadId, owner,
    } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
    this.verifyPayload();
  }

  verifyPayload() {
    if (!this.owner) {
      throw new Error('NEW_COMMENT.NOT_LOGIN');
    }

    if (!this.content || !this.threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof this.content !== 'string' || typeof this.threadId !== 'string' || typeof this.owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
