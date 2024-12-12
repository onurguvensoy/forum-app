const {createSecretToken} = require('../util/SecretToken');

test('createSecretToken function should return a token', () => {
  const token = createSecretToken
    expect(token).toBeDefined();
    expect(typeof token).toBe('function');
});