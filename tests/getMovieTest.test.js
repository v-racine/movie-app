const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('get a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: users want to view ONE movie', () => {
    let rsp;

    let id = 2;

    let movies = {
      rows: [
        {
          id: 2,
          movie_title: 'Notorious',
          movie_year: 1946,
          run_time: 101,
        },
      ],
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(movies);
        });
      });

      rsp = await request(app).get(`/movies/${id}`).send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return all the information about that ONE movie', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        `SELECT * FROM movies WHERE id = $1`,
        id.toString(),
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });
});
