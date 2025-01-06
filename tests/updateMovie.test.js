const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('update a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to view the form to edit a movie', () => {
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

  describe('when: a user does NOT enter a valid title', () => {
    let rsp;

    let movie = {
      title: '',
      year: 1991,
      runTime: 122,
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

    test("then: we return 'Title must be between 1 and 250 characters'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid year', () => {
    let rsp;

    let movie = {
      title: 'Point Break',
      year: 21,
      runTime: 122,
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

    test("then: we return 'Year must be a 4-digit number'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid run time', () => {
    let rsp;

    let movie = {
      title: 'Point Break',
      year: 1991,
      runTime: '2h2',
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

    test("then: we return 'Run time must be in minutes'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid title NOR a valid year', () => {
    let rsp;

    let movie = {
      title: '',
      year: 'year',
      runTime: 122,
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

    test("then: we return both 'Title must be between 1 and 250 characters' AND 'Year must be a 4-digit number'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user successfully submits the edit-movie form', () => {
    let rsp;
    let id = '21';

    let old = {
      id: id,
      title: 'Playtime',
      year: 1976,
      runTime: 100,
    };

    let updated = {
      id: id,
      title: 'Playtime',
      year: 1967,
      runTime: 115,
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
