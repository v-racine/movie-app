const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

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

  describe("when a user attempts submits the 'sign up' form BUT the email already exists in the db", () => {});

  describe("when a user attempts submits the 'sign up' form BUT the password and password confirmation do NOT match", () => {});

  describe("when a user successfully submits the 'sign up' form", () => {});
});
