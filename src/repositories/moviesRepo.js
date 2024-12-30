const { Config } = require('../config/config');
const { Client } = require('pg');

const isProduction = Config.Get().nodeEnv === 'prod';

const CONNECTION = {
  connectionString: `${Config.Get().dbServerAddress}/${Config.Get().db}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

class MoviesRepo {
  async dbQuery(statement, ...parameters) {
    let client = new Client(CONNECTION);

    try {
      await client.connect();

      return await client.query(statement, parameters);
    } catch (err) {
      console.log('something is broken:', err);
      //TODO: rethrow?
    } finally {
      client.end();
    }
  }

  async displayAll() {}

  async displayOne() {}

  async getOneBy() {}

  async create() {}

  async update() {}

  async delete() {}
}

module.exports = { MoviesRepo };
