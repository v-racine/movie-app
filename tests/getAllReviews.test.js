const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('get all reviews', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: user wants to view ALL reviews', () => {
    let rsp;

    let reviews = {
      rows: [
        {
          id: 3,
          reviewer: 'my chicken',
          grade: 'c',
          comments: 'stoopid chicken movie',
          movie_id: 4,
          movie_title: 'Point Break',
        },
      ],
    };

    beforeEach(async () => {
      mockPgClient.dbQuery = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(reviews);
        });
      });

      rsp = await request(app).get('/reviews').send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return all the reviews with the movie title and the grade', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        `SELECT reviews.*, movie_title FROM reviews JOIN movies ON movies.id = reviews.movie_id`,
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });
});
