const { Config } = require('../src/config/config');

Config.Get(process.env);

const { AppFactory, store } = require('../src/app');
const request = require('supertest');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

describe('sign out', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to sign out', () => {
    let rsp;

    beforeEach(async () => {
      rsp = await request(app).post('/signOut').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return a success flash message and redirect to the homepage', async () => {
      const status = rsp.status;
      expect(status).toBe(302);

      const c = cookie.parse(rsp.headers['set-cookie'][0]);
      const encryptedSessionId = c['movie-app-session-id'];
      const decryptedSessionId = cookieParser.signedCookie(
        encryptedSessionId,
        'this is not very secure',
      );

      const sessions = store.sessions;
      const session = JSON.parse(sessions[decryptedSessionId]);
      const userId = session.userId;

      expect(userId).not.toBeDefined();

      const text = rsp.text;
      expect(text).toMatchSnapshot();
    });
  });
});
