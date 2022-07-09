const payloadGoogleLogin = {
  iss: 'accounts.google.com',
  azp: 'test.apps.googleusercontent.com',
  aud: 'test.apps.googleusercontent.com',
  sub: 'mockedGoogleId',
  email: 'test@gmail.com',
  email_verified: true,
  at_hash: 'Ox4zT_5VoJKwfLYV7gmB_w',
  name: 'Test',
  picture: 'https://lh3.googleusercontent.com/a/AATXAJyqlf1-4f7KnIakfs_vqCoaMa4BQev8dHIRPTBO=s96-c',
  given_name: 'test',
  family_name: 'user',
  locale: 'id',
  iat: 1643107738,
  exp: 1643111338,
  jti: 'da9c862d813dd56d405b8d64f8fc1bfe7ad3aa8c',
};

const verifyIdTokenMock = jest.fn(() => {
  return {
    getPayload() {
      return payloadGoogleLogin;
    },
  };
});

module.exports = {
  OAuth2Client: jest.fn().mockImplementation(() => {
    return {
      verifyIdToken: verifyIdTokenMock,
    };
  }),
};
