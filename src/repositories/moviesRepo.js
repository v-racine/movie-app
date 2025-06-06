class MoviesRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async getAll(queryStrings) {
    const { title, year, runTime } = queryStrings;
    let newQueryObject = {
      movie_title: title,
      movie_year: year,
      run_time: runTime,
    };

    let allQueryParamsAndValues = Object.entries(newQueryObject);
    let queryParamsAndValues = allQueryParamsAndValues.filter((subArr) => subArr[1]);

    let result;

    if (queryParamsAndValues.length > 0) {
      let ALL_MOVIES = `SELECT * FROM ${this.table} WHERE `;
      const params = [];
      let count = 1;

      for (const [key, value] of queryParamsAndValues) {
        if (count === queryParamsAndValues.length) {
          ALL_MOVIES += `${key} = $${count}`;
        } else {
          ALL_MOVIES += `${key} = $${count} AND `;
        }
        params.push(value);

        count++;
      }
      ALL_MOVIES += ` ORDER BY movie_year, movie_title`;
      result = await this.client.dbQuery(ALL_MOVIES, ...params);
    } else {
      const ALL_MOVIES = `SELECT * FROM ${this.table} ORDER BY movie_year, movie_title`;

      result = await this.client.dbQuery(ALL_MOVIES);
    }

    return result.rows;
  }

  async getOne(id) {
    const MOVIE = `SELECT * FROM ${this.table} WHERE id = $1`;

    const result = await this.client.dbQuery(MOVIE, id);

    return result.rows[0];
  }

  async getOneBy(filters) {
    let query = `SELECT * FROM ${this.table} WHERE `;

    const params = [];

    let count = 1;

    const entries = Object.entries(filters);

    const len = entries.length;

    for (const [key, value] of entries) {
      if (count === len) {
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
    const CREATE_MOVIE = `INSERT INTO ${this.table} (movie_title, movie_year, run_time) VALUES ($1, $2, $3)`;

    const { title, year, runTime } = attrs;

    await this.client.dbQuery(CREATE_MOVIE, title, year, runTime);
  }

  async update(id, updatedMovie) {
    const UPDATED_MOVIE = `UPDATE ${this.table} SET movie_title = $1, movie_year = $2, run_time = $3 WHERE id = $4`;

    const { title, year, runTime } = updatedMovie;

    await this.client.dbQuery(UPDATED_MOVIE, title, year, runTime, id);
  }

  async delete(id) {
    const DELETE_MOVIE = `DELETE FROM ${this.table} WHERE id = $1`;

    await this.client.dbQuery(DELETE_MOVIE, id);
  }
}

module.exports = { MoviesRepo };
