const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('add a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a use wants to view the form to add a movie', () => {
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

  describe('when: a user tries to enter a title that already exists', () => {
    let rsp;

    let movie = {
      title: 'Point Break',
      year: 1991,
      runTime: 122,
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [movie] });
        });
      });

      rsp = await request(app)
        .post(`/movies/create`)
        .send(`title=${movie.title}&year=${movie.year}&runTime=${movie.runTime}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Movie already exists", async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(1);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM movies WHERE movie_title = $1',
        movie.title,
      );

      const text = rsp.text;
      expect(text).toContain('Movie already exists');

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user successfully adds a new movie', () => {
    let rsp;

    let movie = {
      title: 'Point Break',
      year: 1991,
      runTime: 122,
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [] });
        });
      });

      rsp = await request(app)
        .post(`/movies/create`)
        .send(`title=${movie.title}&year=${movie.year}&runTime=${movie.runTime}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we add the movie to the db AND redirect user to all the movie titles', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(2);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM movies WHERE movie_title = $1',
        movie.title,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        2,
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
