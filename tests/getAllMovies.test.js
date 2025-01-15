const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('get all movies', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to view all movies with NO query strings', () => {
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

    test('then: we return all the movie titles', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY movie_year');

      const text = rsp.text;
      expect(text).toMatchSnapshot();
      // expect(text).toEqual(JSON.stringify(movies.rows));

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user want to view all movies with a specific release year', () => {
    let rsp;

    let movies = {
      rows: [
        { id: 1, title: 'There Will Be Blood', year: 2007, runTime: 158 },
        { id: 2, title: 'No Country for Old Men', year: 2007, runTime: 122 },
      ],
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(movies);
        });
      });

      rsp = await request(app).get('/movies?year=2007').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return all the movie titles with the specified release year', () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE movie_title = $1 OR movie_year = $2 OR run_time = $3 ORDER BY movie_year',
        undefined,
        '2007',
        undefined,
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });
});
