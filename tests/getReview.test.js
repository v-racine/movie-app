const { Config } = require('../src/config/config');

Config.Get(process.env);

const AppFactory = require('../src/app');
const request = require('supertest');

describe('get a review', () => {
  const mockPgClient = {};

  const app = AppFactory({
    pgClient: mockPgClient,
  });

  describe('when: users want to view ONE review', () => {
    let rsp;
    let id = 3;

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

      rsp = await request(app).get(`/reviews/${id}`).send();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('then: we return all the information about that ONE review', async () => {
      expect(mockPgClient.dbQuery).toHaveBeenCalledWith(
        'SELECT reviews.*, movie_title FROM reviews JOIN movies ON movies.id = reviews.movie_id WHERE reviews.id = $1',
        id.toString(),
      );

      const text = rsp.text;
      expect(text).toMatchSnapshot();

      const status = rsp.status;
      expect(status).toBe(200);
    });
  });
});
