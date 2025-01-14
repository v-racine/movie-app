const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('update a movie', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: a user wants to view the form to edit a review', () => {
    let rsp;
    let id = 21;

    let review = {
      reviewer: 'Phillips',
      grade: 'A',
      comments: '',
      movie_id: 32,
      movie_title: 'Point Break',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [review] });
        });
      });

      rsp = await request(app).get(`/reviews/update/${id}`).send();
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

  describe('when: a user does NOT enter a valid reviewer', () => {
    let rsp;
    let id = 52;

    let review = {
      reviewer: '',
      grade: 'A',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/update/${id}`)
        .send(`reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`);
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
    let id = 52;

    let review = {
      reviewer: 'Phillips',
      grade: 'poop',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/update/${id}`)
        .send(`reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Invalid grade", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user does NOT enter a valid reviewer NOR a valid grade', () => {
    let rsp;
    let id = 52;

    let review = {
      reviewer: '',
      grade: 'poop',
      comments: '',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn();

      rsp = await request(app)
        .post(`/reviews/update/${id}`)
        .send(`reviewer=${review.reviewer}&grade=${review.grade}&comments=${review.comments}`);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("then: we return 'Reviewer's name must be between 1 and 250 characters' AND 'Invalid grade", async () => {
      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });

  describe('when: a user successfully updates a review', () => {
    let rsp;
    let id = '21';

    let oldReview = {
      id: id,
      reviewer: 'Phillips',
      grade: 'A',
      comments: '',
    };

    let updatedReview = {
      id: id,
      reviewer: 'Phillips',
      grade: 'B',
      comments: 'Not so good afterall',
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({ rows: [oldReview] });
        });
      });
      rsp = await request(app)
        .post(`/reviews/update/${id}`)
        .send(
          `reviewer=${updatedReview.reviewer}&grade=${updatedReview.grade}&comments=${updatedReview.comments}`,
        );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we update the review & redirect to the reviews list', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledTimes(2);

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT reviews.*, movie_title FROM reviews JOIN movies ON movies.id = reviews.movie_id WHERE reviews.id = $1',
        id,
      );

      expect(mockPgClient.dbQuery).toHaveBeenNthCalledWith(
        2,
        'UPDATE reviews SET reviewer = $1, grade = $2, comments = $3 WHERE id = $4',
        updatedReview.reviewer,
        updatedReview.grade,
        updatedReview.comments,
        id,
      );

      const status = rsp.status;
      expect(status).toBe(302);
    });
  });
});
