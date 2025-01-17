const { Config } = require('../src/config/config');

Config.Get(process.env);

const { AppFactory } = require('../src/app');
const request = require('supertest');

describe('delete a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to delete a review', () => {
    let rsp;

    let id = 42;

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app).post(`/reviews/delete/${id}`).send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we send the correct ID to PgClient AND redirect to reviews page', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        'DELETE FROM reviews WHERE id = $1',
        id.toString(),
      );

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
