class MoviesRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.pgClient;
  }

  async getAll() {
    //query

    this.client.dbQuery();
  }

  async getOne() {}

  async getOneBy() {}

  async create() {}

  async update() {}

  async delete() {}
}

module.exports = { MoviesRepo };
