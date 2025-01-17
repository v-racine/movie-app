const { Config } = require('./config/config');

Config.Get(process.env);

const { AppFactory } = require('./app');

const { PgClient } = require('./repositories/pgClient');

const isProduction = Config.Get().nodeEnv === 'prod';

const CONNECTION = {
  connectionString: `${Config.Get().dbServerAddress}/${Config.Get().db}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

const app = AppFactory({
  pgClient: new PgClient(CONNECTION),
});

//listener
app.listen(Config.Get().serverPort, () => {
  console.log('Listening on port 3000...');
});

//npm run dev to run the program
