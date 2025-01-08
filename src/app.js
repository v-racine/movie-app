const express = require('express');
const session = require('express-session');
const flash = require('express-flash');

const { parseTitle, parseYear, parseRuntime } = require('./middleware/parsers');
const { ErrorHandler } = require('./middleware/errorHandler');

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

  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
        path: '/',
        secure: false,
      },
      name: 'movie-app-session-id',
      resave: false,
      saveUninitialized: true,
      secret: 'this is not very secure',
    }),
  );
  app.use(flash());
  app.use(ErrorHandler);

  //middleware for flash messages before a redirect
  app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
  });

  // create handlers
  const homeHandler = new HomeHandler();
  const moviesHandler = new MoviesHandler({ moviesService });

  // register handlers to routes
  app.get('/', homeHandler.getHomePage);
  app.get('/movies', moviesHandler.getAllMovies);
  app.get('/movies/create', moviesHandler.createMovie);
  app.post('/movies/create', [parseTitle, parseYear, parseRuntime], moviesHandler.createMoviePost);
  app.get('/movies/:id', moviesHandler.getMovie);
  app.get('/movies/update/:id', moviesHandler.updateMovie);
  app.post(
    '/movies/update/:id',
    [parseTitle, parseYear, parseRuntime],
    moviesHandler.updateMoviePost,
  );
  app.post('/movies/delete/:id', moviesHandler.deleteMovie);

  return app;
};

module.exports = AppFactory;
