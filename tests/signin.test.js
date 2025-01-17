const { Config } = require('../src/config/config');

Config.Get(process.env);

const { AppFactory, store } = require('../src/app');
const request = require('supertest');
const { PasswordHelper } = require('../src/utilities/passwordHelper');

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

  describe("when: the user attempt to submit the 'sign-in' form BUT enters an incorrect password", () => {});
  describe("when: the user successfully submits the 'sign-in' form", () => {});
});
