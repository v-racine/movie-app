const { Config } = require('./config/config');

Config.Get(process.env);

const AppFactory = require('./app');

const { MoviesRepo } = require('./repositories/moviesRepo');

const app = AppFactory({
  moviesRepo: new MoviesRepo('movies'),
});

//listener
app.listen(Config.Get().serverPort, () => {
  console.log('Listening on port 3000...');
});

//npm run dev to run the program
