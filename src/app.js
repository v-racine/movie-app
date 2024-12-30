const express = require('express');

const { MovieService } = require('./services/moviesService');

const AppFactory = (args) => {
  //repos
  const moviesRepo = args.moviesRepo;

  //services (business logic layer)
  const moviesService = new MovieService({ moviesRepo });

  //create server (and middlewares)
  const app = express();

  // create handlers
  const moviesHandler = new MoviesHandler({ moviesService });

  // register handlers to routes
  app.get('/movies', moviesHandler.getAllMovies);

  app.get('/movies/:id', moviesHandler.getMovie);

  app.get('movies/create', moviesHandler.createMovie);

  app.post('movies/create', moviesHandler.createMoviePost);

  app.get('movies/update/:id', moviesHandler.updateMovie);

  app.post('movies/update/:id', moviesHandler.updateMoviePost);

  app.post('/movies/delete/:id', moviesHandler.deleteMovie);

  return app;
};

module.exports = AppFactory;
