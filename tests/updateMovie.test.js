const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('update a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when a use wants to view the form to edit a movie', () => {
    let rsp;
    let id = 21;

    beforeEach(async () => {
      rsp = await request(app).get(`/movies/update/${id}`).send();
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

  describe('when a users submits the edit-movie form', () => {
    let rsp;
    let id = '21';

    let old = {
      id: id,
      title: 'Playtime',
      year: '1976',
      runTime: '3',
    };

    let updated = {
      id: id,
      title: 'Playtime',
      year: '1967',
      runTime: '115',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [old] });
        });
      });

      rsp = await request(app)
        .post(`/movies/update/${id}`)
        .send(`title=${updated.title}&year=${updated.year}&runTime=${updated.runTime}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we update the movie & redirect to the movies page', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(2);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM movies WHERE id = $1',
        id,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        2,
        'UPDATE movies SET movie_title = $1, movie_year = $2, run_time = $3 WHERE id = $4',
        updated.title,
        updated.year,
        updated.runTime,
        id,
      );

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
