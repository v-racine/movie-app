class MoviesRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async getAll() {
    const ALL_MOVIES = `SELECT * FROM ${this.table} ORDER BY id`;

    const result = await this.client.dbQuery(ALL_MOVIES);

    return result.rows;
  }

  async getOne(id) {
    const MOVIE = `SELECT * FROM ${this.table} WHERE id = $1`;

    const result = await this.client.dbQuery(MOVIE, id);

    return result.rows[0];
  }

  async getOneBy() {}

  async create(attrs) {
    const CREATE_MOVIE = `INSERT INTO ${this.table} (movie_title, movie_year, run_time) VALUES ($1, $2, $3)`;

    const { title, year, runTime } = attrs;

    await this.client.dbQuery(CREATE_MOVIE, title, year, runTime);
  }

  async update() {}

  async delete(id) {
    const DELETE_MOVIE = `DELETE FROM ${this.table} WHERE id = $1`;

    await this.client.dbQuery(DELETE_MOVIE, id);
  }
}

module.exports = { MoviesRepo };
