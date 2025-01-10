class ReviewsRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async getAll() {
    const ALL_REVIEWS = `SELECT ${this.table}.*, movie_title FROM ${this.table} JOIN movies ON movies.id = reviews.movie_id`;

    const result = await this.client.dbQuery(ALL_REVIEWS);

    return result.rows;
  }

  async getOne(id) {
    const REVIEW = `SELECT * FROM ${this.table} WHERE id = $1`;

    const result = await this.client.dbQuery(REVIEW, id);

    return result.rows[0];
  }

  async getOneBy(attrs) {
    let query = `SELECT * FROM ${this.table} WHERE `;

    const params = [];
    let count = 1;

    const entries = Object.entries(attrs);

    for (const [key, value] of entries) {
      if (count === entries.length) {
        query += `${key} = $${count}`;
      } else {
        query += `${key} = $${count} AND`;
      }

      params.push(value);
      count++;
    }

    const result = await this.client.dbQuery(query, ...params);

    return result.rows[0];
  }

  async create(attrs) {
    const CREATE_REVIEW = `INSERT INTO ${this.table} (reviewer, grade, comments) VALUES ($1, $2, $3, $4)`;

    const { reviewer, grade, comments, movie_id } = attrs;

    await this.client.dbQuery(CREATE_REVIEW, reviewer, grade, comments, movie_id);
  }

  async update(id, updatedReview) {
    const UPDATED_REVIEW = `UPDATE ${this.table} SET reviewer = $1, grade = $2, comments = $3 WHERE id = $4`;

    const { reviewer, grade, comments } = updatedReview;

    await this.client.dbQuery(UPDATED_REVIEW, reviewer, grade, comments, id);
  }

  async delete(id) {
    const DELETE_REVIEW = `DELETE FROM ${this.table} WHERE id = $1`;

    await this.client.dbQuery(DELETE_REVIEW, id);
  }

  async getAllReviewsForOneMovie(movieId) {
    const ALL_REVIEWS_OF_ONE_MOVIE = `
    SELECT * FROM ${this.table} 
    JOIN movies 
    ON movies.id = reviews.movie_id
    WHERE movies.id = $1`;

    const result = await this.client.dbQuery(ALL_REVIEWS_OF_ONE_MOVIE, movieId);

    return result.rows;
  }

  async getAllReviewsByOneReviewer(reviewer) {
    const ALL_REVIEWS_BY_ONE_REVIEWER = `
    SELECT ${this.table}.*, movie_title FROM ${this.table} 
    JOIN movies 
    ON movies.id = reviews.movie_id
    WHERE reviewer = $1`;

    const result = await this.client.dbQuery(ALL_REVIEWS_BY_ONE_REVIEWER, reviewer);

    return result.rows;
  }
}

module.exports = { ReviewsRepo };
