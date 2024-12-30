const express = require('express');

const { MovieService } = require('./services/moviesService');

const AppFactory = (args) => {
  //repos
  const moviesRepo = args.moviesRepo;

  //services (business logic layer)
  const moviesService = new MovieService({ moviesRepo });

  //create server (and middlewares)
  const app = express();

  app.get('/movies', () => {});

  app.get('/movies/:id', () => {});

  app.get('movies/create', () => {});

  app.post('movies/create', () => {});

  app.get('movies/update/:id', () => {});

  app.post('movies/update/:id', () => {});

  app.post('/movies/delete/:id', () => {});

  return app;
};

module.exports = AppFactory;
