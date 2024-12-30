class Config {
  static Instance = undefined;

  static Get(env) {
    return new Config(env);
  }

  constructor(env) {
    if (Config.Instance) {
      return Config.Instance;
    }

    this.nodeEnv = 'dev';
    this.serverPort = '3000';
    this.dbServerAddress = 'postgresql://localhost:5432';
    this.db = 'movie-app';

    if (env.NODE_ENV !== undefined) {
      this.nodeEnv = env.NODE_ENV;
    }

    if (env.SERVER_PORT !== undefined) {
      this.serverPort = env.SERVER_PORT;
    }

    if (env.DB_STORE_ADDRESS !== undefined) {
      this.dbServerAddress = env.DB_STORE_ADDRESS;
    }

    if (env.DB !== undefined) {
      this.db = env.DB;
    }

    Object.freeze(this);

    Config.Instance = this;
  }
}

module.exports = { Config };
