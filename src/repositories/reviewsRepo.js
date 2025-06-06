class ReviewsRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async getAll() {
    const ALL_REVIEWS = `SELECT ${this.table}.*, movie_title FROM ${this.table} JOIN movies ON movies.id = ${this.table}.movie_id`;

    const result = await this.client.dbQuery(ALL_REVIEWS);

    return result.rows;
  }

  async getOne(id) {
    const REVIEW = `SELECT ${this.table}.*, movie_title FROM ${this.table} JOIN movies ON movies.id = ${this.table}.movie_id WHERE ${this.table}.id = $1`;

    const result = await this.client.dbQuery(REVIEW, id);

    return result.rows[0];
  }

  async getOneBy(attrs) {
    const FETCH_MOVIE_ID = `SELECT id FROM movies WHERE movie_title = $1`;

    let { title } = attrs;

    const firstResult = await this.client.dbQuery(FETCH_MOVIE_ID, title);

    const movieId = firstResult.rows[0].id;

    let query = `SELECT * FROM ${this.table} WHERE `;

    const params = [];

    let count = 1;

    const { reviewer } = attrs;

    const newObj = {
      reviewer: reviewer,
      movie_id: movieId,
    };

    const entries = Object.entries(newObj);

    for (const [key, value] of entries) {
      if (count === entries.length) {
        query += `${key} = $${count}`;
      } else {
        query += `${key} = $${count} AND `;
      }

      params.push(value);
      count++;
    }

    const result = await this.client.dbQuery(query, ...params);

    return result.rows[0];
  }

  async create(attrs) {
    const FETCH_MOVIE_ID = `SELECT id FROM movies WHERE movie_title = $1`;
    let { title } = attrs;
    const result = await this.client.dbQuery(FETCH_MOVIE_ID, title);
    const movieId = result.rows[0].id;

    const CREATE_REVIEW = `INSERT INTO ${this.table} (reviewer, grade, comments, movie_id, user_id) VALUES ($1, $2, $3, $4, $5)`;
    const { reviewer, grade, comments, userId } = attrs;

    await this.client.dbQuery(CREATE_REVIEW, reviewer, grade, comments, movieId, userId);
  }

  async update(id, updatedReview, userId) {
    const UPDATED_REVIEW = `UPDATE ${this.table} SET reviewer = $1, grade = $2, comments = $3, user_id = $4 WHERE id = $5`;

    const { reviewer, grade, comments } = updatedReview;

    await this.client.dbQuery(UPDATED_REVIEW, reviewer, grade, comments, userId, id);
  }

  async delete(id, userId) {
    const DELETE_REVIEW = `DELETE FROM ${this.table} WHERE id = $1 AND user_id = $2`;

    await this.client.dbQuery(DELETE_REVIEW, id, userId);
  }

  async getAllReviewsOfOneMovie(movieId) {
    const ALL_REVIEWS_OF_ONE_MOVIE = `SELECT ${this.table}.*, movie_title FROM ${this.table} JOIN movies ON movies.id = ${this.table}.movie_id WHERE movies.id = $1`;

    const result = await this.client.dbQuery(ALL_REVIEWS_OF_ONE_MOVIE, movieId);

    return result.rows;
  }

  async getAllReviewsByOneReviewer(reviewer) {
    const ALL_REVIEWS_BY_ONE_REVIEWER = `SELECT ${this.table}.*, movie_title FROM ${this.table} JOIN movies ON movies.id = ${this.table}.movie_id WHERE reviewer = $1`;

    const result = await this.client.dbQuery(ALL_REVIEWS_BY_ONE_REVIEWER, reviewer);

    return result.rows;
  }
}

module.exports = { ReviewsRepo };
