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

  async create() {}

  async update() {}

  async delete() {}
}

module.exports = { MoviesRepo };
