class UsersRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async create(attrs) {}
}

module.exports = { UsersRepo };
