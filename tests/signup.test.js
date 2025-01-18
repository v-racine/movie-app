const { Config } = require('../src/config/config');

Config.Get(process.env);

const { AppFactory, store } = require('../src/app');
const request = require('supertest');
const { PasswordHelper } = require('../src/utilities/passwordHelper');
const cookieParser = require('cookie-parser'); //REMOVE LATER
const cookie = require('cookie'); //REMOVE LATER

describe('sign up', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to view the form to signup', () => {
    let rsp;

    beforeEach(async () => {
      rsp = await request(app).get('/signUp').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return the view of the form', async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe("when a user attempts submits the 'sign up' form BUT the email already exists in the db", () => {
    let rsp;

    let id = '3424';

    let newUser = {
      id: id,
      username: 'Phillips',
      email: 'test@test.com',
      password: 'asdf',
      passwordConfirmation: 'asdf',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [{ email: 'test@test.com' }] });
        });
      });

      rsp = await request(app)
        .post('/signUp')
        .send(
          `username=${newUser.username}&email=${newUser.email}&password=${newUser.password}&passwordConfirmation=${newUser.passwordConfirmation}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return a 'Email in use'", async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(1);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM users WHERE email = $1',
        newUser.email,
      );

      const status = rsp.status;
      expect(status).toBe(200);

      const text = rsp.text;
      expect(text).toContain('Email in use');
    });
  });

  describe("when a user attempts submits the 'sign up' form BUT the password and password confirmation do NOT match", () => {
    let rsp;

    let id = '3424';

    let newUser = {
      id: id,
      username: 'Phillips',
      email: 'test@test.com',
      password: 'asdf',
      passwordConfirmation: 'asdfghjk',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [] });
        });
      });

      rsp = await request(app)
        .post('/signUp')
        .send(
          `username=${newUser.username}&email=${newUser.email}&password=${newUser.password}&passwordConfirmation=${newUser.passwordConfirmation}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Password must match'", async () => {
      const status = rsp.status;
      expect(status).toBe(200);

      const text = rsp.text;
      expect(text).toContain('Passwords must match');
    });
  });

  describe("when a user successfully submits the 'sign up' form", () => {
    let rsp;

    let id = '3424';

    let newUser = {
      id: id,
      username: 'Phillips',
      email: 'test@test.com',
      password: 'asdf',
      passwordConfirmation: 'asdf',
    };

    let hex =
      'cf5dc7df47b8f0b6655cefb9457816a0ca15c1d32576e62d8c1cc768acc2ffcd1747570339747b02865fb78eaf46919392d1a33e652b67c05cd820d88a43edb8';

    let salt = 'f8864ab11acaed11';

    beforeEach(async () => {
      mockPgClient.dbQuery = jest
        .fn()
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [] });
          });
        })
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [{ id: id }] });
          });
        });

      PasswordHelper.HexAndSalt = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve({ hex: hex, salt: salt });
        });
      });

      rsp = await request(app)
        .post('/signUp')
        .send(
          `username=${newUser.username}&email=${newUser.email}&password=${newUser.password}&passwordConfirmation=${newUser.passwordConfirmation}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we redirect to the home page with a flash message, 'Account created!'", async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(2);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM users WHERE email = $1',
        newUser.email,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING * ',
        newUser.username,
        newUser.email,
        `${hex}.${salt}`,
      );

      const toClient = rsp.get('set-cookie')[0];
      expect(toClient).toBeDefined();

      const c = cookie.parse(rsp.headers['set-cookie'][0]);
      const encryptedSessionId = c['movie-app-session-id'];
      const decryptedSessionId = cookieParser.signedCookie(
        encryptedSessionId,
        'this is not very secure',
      );

      const sessions = store.sessions;
      const session = JSON.parse(sessions[decryptedSessionId]);
      const userId = session.userId;

      expect(userId).toBe(id);

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
