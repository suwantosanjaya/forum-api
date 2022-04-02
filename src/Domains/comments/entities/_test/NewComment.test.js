const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when not contain owner', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-1234',
    };

    // Action & Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_LOGIN');
  });
  it('should throw error when payload not contain needed property / bad payload', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 'thread-1234',
      owner: 123,
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-1234',
      owner: 'user-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
