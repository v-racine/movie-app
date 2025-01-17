class UsersRepo {
  constructor(args) {
    this.table = args.table;
    this.client = args.client;
  }

  async create(attrs) {
    const NEW_USER = `INSERT INTO ${this.table} (username, email, password) VALUES ($1, $2, $3) RETURNING * `;

    const { username, email, password } = attrs;

    const result = await this.client.dbQuery(NEW_USER, username, email, password);

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
}

module.exports = { UsersRepo };
