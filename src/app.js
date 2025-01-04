const express = require('express');
const { MoviesRepo } = require('./repositories/moviesRepo');
const { MovieService } = require('./services/moviesService');
const { MoviesHandler } = require('./handlers/moviesHandler');
const { HomeHandler } = require('./handlers/homeHandler');

const AppFactory = (args) => {
  //repos
  const moviesRepo = new MoviesRepo({
    table: 'movies',
    client: args.pgClient,
  });

  //services (business logic layer)
  const moviesService = new MovieService({ moviesRepo });

  //create server (and middlewares)
  const app = express();

  app.set('views', 'src/views');
  app.set('view engine', 'pug');

  app.use(express.static('src/public'));
  app.use(express.urlencoded({ extended: false }));

  // create handlers
  const homeHandler = new HomeHandler();
  const moviesHandler = new MoviesHandler({ moviesService });

  // register handlers to routes
  app.get('/', homeHandler.getHomePage);
  app.get('/movies', moviesHandler.getAllMovies);
  app.get('/movies/create', moviesHandler.createMovie);
  app.post('/movies/create', moviesHandler.createMoviePost);
  app.get('/movies/:id', moviesHandler.getMovie);
  app.get('/movies/update/:id', moviesHandler.updateMovie);
  app.post('/movies/update/:id', moviesHandler.updateMoviePost);
  app.post('/movies/delete/:id', moviesHandler.deleteMovie);

  return app;
};

module.exports = AppFactory;
