const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('add a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when a use wants to view the form to add a movie', () => {
    let rsp;

    beforeEach(async () => {
      rsp = await request(app).get('/movies/create').send();
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

  describe('when a user adds a new movie', () => {
    let rsp;

    let movie = {
      title: 'Point Break',
      year: '1991',
      runTime: '122',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/movies/create`)
        .send(`title=${movie.title}&year=${movie.year}&runTime=${movie.runTime}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we add the movie to the db AND redirect user to all the movie titles', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        'INSERT INTO movies (movie_title, movie_year, run_time) VALUES ($1, $2, $3)',
        movie.title,
        movie.year,
        movie.runTime,
      );

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
