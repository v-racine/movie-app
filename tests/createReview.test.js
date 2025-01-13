const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('add a review', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to view the form to add a review ', () => {
    let rsp;

    beforeEach(async () => {
      rsp = await request(app).get('/reviews/create').send();
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

    let review = {
      title: '',
      reviewer: 'Phillips',
      grade: 'A+',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/create`)
        .send(
          `title=${review.title}&reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Movie title must be between 1 and 250 characters'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid reviewer', () => {
    let rsp;

    let review = {
      title: 'Point Break',
      reviewer: '',
      grade: 'A+',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/create`)
        .send(
          `title=${review.title}&reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Reviewer's name must be between 1 and 250 characters'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid grade', () => {
    let rsp;

    let review = {
      title: 'Point Break',
      reviewer: 'Phillips',
      grade: 'poop',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/create`)
        .send(
          `title=${review.title}&reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Invalid grade'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid title NOR a valid grade', () => {
    let rsp;

    let review = {
      title: '',
      reviewer: 'Phillips',
      grade: '',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/create`)
        .send(
          `title=${review.title}&reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Movie title must be between 1 and 250 characters' AND 'Invalid grade'", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a reviewer tries to add a review of a movie that they already reviewed', () => {
    let rsp;

    let id = 4;

    let review = {
      title: 'Point Break',
      reviewer: 'Phillips',
      grade: 'A+',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest
        .fn()
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [{ id: id }] });
          });
        })
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [review] });
          });
        });

      rsp = await request(app)
        .post(`/reviews/create`)
        .send(
          `title=${review.title}&reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'A review of this movie was already submitted by the reviewer.", async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(2);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM movies WHERE movie_title = $1',
        review.title,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        2,
        'SELECT * FROM reviews WHERE reviewer = $1 AND movie_id = $2',
        review.reviewer,
        id,
      );

      const text = rsp.text;
      expect(text).toContain('A review of this movie was already submitted by the reviewer.');

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user successfully adds a new review', () => {
    let rsp;

    let id = 4;

    let review = {
      title: 'Point Break',
      reviewer: 'Phillips',
      grade: 'A%2B',
      comments: '',
      movieId: 4,
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest
        .fn()
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [{ id: id }] });
          });
        })
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [] });
          });
        })
        .mockImplementationOnce(() => {
          return new Promise((resolve) => {
            resolve({ rows: [{ id: id }] });
          });
        });

      rsp = await request(app)
        .post(`/reviews/create`)
        .send(
          `title=${review.title}&reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we add the review to the db AND redirect user to all the reviews', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(4);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM movies WHERE movie_title = $1',
        review.title,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        2,
        'SELECT * FROM reviews WHERE reviewer = $1 AND movie_id = $2',
        review.reviewer,
        review.movieId,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        3,
        'SELECT id FROM movies WHERE movie_title = $1',
        review.title,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        4,
        'INSERT INTO reviews (reviewer, grade, comments, movie_id) VALUES ($1, $2, $3, $4)',
        review.reviewer,
        'A+',
        review.comments,
        review.movieId,
      );

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
