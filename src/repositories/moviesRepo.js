class MoviesRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async getAll() {
    const query = `SELECT * FROM ${this.table} ORDER BY id`;

    const result = await this.client.dbQuery(query);

    return JSON.stringify(result.rows);
  }

  async getOne() {}

  async getOneBy() {}

  async create() {}

  async update() {}

  async delete() {}
}

module.exports = { MoviesRepo };
