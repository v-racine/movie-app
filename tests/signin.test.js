const { Config } = require('../src/config/config');

Config.Get(process.env);

const { AppFactory, store } = require('../src/app');
const request = require('supertest');

describe('sign in', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to view the form to signin', () => {
    let rsp;

    beforeEach(async () => {
      rsp = await request(app).get('/signIn').send();
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

  describe("when: the user attempt to submit the 'sign-in' form BUT enters an incorrect email", () => {
    let rsp;
    let id = '3424';

    let user = {
      id: id,
      username: 'Phillips',
      email: 'test@test.com',
      password: 'asdf',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [] });
        });
      });

      rsp = await request(app)
        .post('/signIn')
        .send(`username=${user.username}&email=${user.email}&password=${user.password}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Email not found'", async () => {
      const status = rsp.status;
      expect(status).toBe(200);

      const text = rsp.text;
      expect(text).toContain('Email not found');
    });
  });

  describe("when: the user attempt to submit the 'sign-in' form BUT enters an incorrect password", () => {
    let rsp;
    let id = '3424';

    let user = {
      id: id,
      username: 'Phillips',
      email: 'test@test.com',
      password: 'papillon2',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({
            rows: [
              {
                username: 'Phillips',
                email: 'test@test.com',
                password:
                  'f0cb357c9960fc49f80c807fbaaf45be391fb69502b22ed29149a7b67e3cb66ffa1cb747e62c7419ff548b0061d1a97d84d8b610da545b94a11c64297e763d8f.e40ff17e1d215c67',
              },
            ],
          });
        });
      });

      rsp = await request(app)
        .post('/signIn')
        .send(`username=${user.username}&email=${user.email}&password=${user.password}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Incorrect password'", async () => {
      const status = rsp.status;
      expect(status).toBe(200);

      const text = rsp.text;
      expect(text).toContain('Incorrect password');
    });
  });

  describe("when: the user successfully submits the 'sign-in' form", () => {
    let rsp;

    let id = '3424';

    let user = {
      id: id,
      username: 'Phillips',
      email: 'test@test.com',
      password: 'papillon',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({
            rows: [
              {
                id: id,
                username: 'Phillips',
                password:
                  'f0cb357c9960fc49f80c807fbaaf45be391fb69502b22ed29149a7b67e3cb66ffa1cb747e62c7419ff548b0061d1a97d84d8b610da545b94a11c64297e763d8f.e40ff17e1d215c67',
              },
            ],
          });
        });
      });

      rsp = await request(app)
        .post('/signIn')
        .send(`username=${user.username}&email=${user.email}&password=${user.password}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we redirect to the movies page with a flash message, 'You're signed in!'", async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(1);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM users WHERE username = $1 AND email = $2',
        user.username,
        user.email,
      );

      const toClient = rsp.get('set-cookie')[0];
      expect(toClient).toBeDefined();

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
