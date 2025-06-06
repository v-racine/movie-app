const { Config } = require('../src/config/config');

Config.Get(process.env);

const { AppFactory } = require('../src/app');
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
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY movie_year, movie_title',
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();
      // expect(text).toEqual(JSON.stringify(movies.rows));

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user wants to view all movies with a specific release year', () => {
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
        'SELECT * FROM movies WHERE movie_year = $1 ORDER BY movie_year, movie_title',
        2007,
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user wants to view all movies with a specific release year AND run time', () => {
    let rsp;

    let movies = {
      rows: [
        { id: 1, title: 'There Will Be Blood', year: 2007, runTime: 158 },
        { id: 2, title: 'No Country for Old Men', year: 2007, runTime: 122 },
        { id: 3, title: 'New Papillon Movie', year: 2025, runTime: 122 },
      ],
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(movies);
        });
      });

      rsp = await request(app).get('/movies?year=2007&runTime=122').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return all the movie titles with the specified release year AND run time', () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE movie_year = $1 AND run_time = $2 ORDER BY movie_year, movie_title',
        2007,
        122,
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user wants to view all movies with a specific release year BUT the user does NOT enter a valid year in the query string', () => {
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

      rsp = await request(app).get('/movies?year=poop').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return a flash error message that says 'Year must be a 4-digit number'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });
});
