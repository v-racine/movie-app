const { Client } = require('pg');

class PgClient {
  constructor(connection) {
    this.connection = connection;
  }

  async dbQuery(statement, ...parameters) {
    let client = new Client(this.connection);

    try {
      await client.connect();

      return await client.query(statement, parameters);
    } catch (err) {
      console.log(`PgClient.dbQuery failed: ${err.message}`);
      throw err;
    } finally {
      client.end();
    }
  }
}

module.exports = { PgClient };
