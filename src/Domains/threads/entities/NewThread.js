class NewThread {
  constructor(payload) {
    const {
      title, body, owner,
    } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
    this.verifyPayload();
  }

  verifyPayload() {
    if (!this.owner) {
      throw new Error('NEW_THREAD.NOT_LOGIN');
    }

    if (!this.title || !this.body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof this.title !== 'string' || typeof this.body !== 'string' || typeof this.owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
