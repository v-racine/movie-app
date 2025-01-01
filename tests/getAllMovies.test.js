const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('get all movies', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: users want to view all movies', () => {
    let rsp;

    let movies = {
      rows: [
        {
          id: 1,
          movie_title: 'Nosferatu',
          movie_year: 2024,
          run_time: 132,
        },
        {
          id: 2,
          movie_title: 'Point Break',
          movie_year: 1991,
          run_time: 122,
        },
      ],
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(movies);
        });
      });

      rsp = await request(app).get('/movies').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return all the movies in an array', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY id');

      const text = rsp.text;
      expect(text).toMatchSnapshot();
      // expect(text).toEqual(JSON.stringify(movies.rows));

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });
});
