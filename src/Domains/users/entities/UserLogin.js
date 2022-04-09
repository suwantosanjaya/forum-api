class UserLogin {
  constructor(payload) {
    this.verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyPayload(payload) {
    const { username, password } = payload;

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserLogin;
