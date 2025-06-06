const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const morgan = require('morgan');

const {
  parseTitle,
  parseYear,
  parseRuntime,
  parseReviewer,
  parseGrade,
  parseComments,
  parseUsername,
  parseEmail,
  parsePassword,
  parsePasswordConfirmation,
} = require('./middleware/parsers');
const {
  parseTitleQuery,
  parseYearQuery,
  parseRuntimeQuery,
} = require('./middleware/queryStringParser');
const { requireAuth } = require('./middleware/authenticator');

const { HomeHandler } = require('./handlers/homeHandler');

const { MoviesRepo } = require('./repositories/moviesRepo');
const { MovieService } = require('./services/moviesService');
const { MoviesHandler } = require('./handlers/moviesHandler');

const { ReviewsRepo } = require('./repositories/reviewsRepo');
const { ReviewsService } = require('./services/reviewsService');
const { ReviewsHandler } = require('./handlers/reviewsHandler');

const { UsersRepo } = require('./repositories/usersRepo');
const { UsersService } = require('./services/usersService');
const { UsersHandler } = require('./handlers/usersHandler');

const store = new session.MemoryStore(); //REMOVE LATER

/**
 *
 * @param {*} args { dbQuery(statement: string, ...parameters string[]): object | object[] }
 * @param {*} testHacks optional (just for tests) { middlewares: ExpressMiddlewareFunctions[] }
 * @returns
 */
const AppFactory = (args, testHacks) => {
  //repos
  const moviesRepo = new MoviesRepo({
    table: 'movies',
    client: args.pgClient,
  });

  const reviewsRepo = new ReviewsRepo({
    table: 'reviews',
    client: args.pgClient,
  });

  const usersRepo = new UsersRepo({
    table: 'users',
    client: args.pgClient,
  });

  //services (business logic layer)
  const moviesService = new MovieService({ moviesRepo });
  const reviewsService = new ReviewsService({ reviewsRepo });
  const usersService = new UsersService({ usersRepo });

  //create server (and middlewares)
  const app = express();

  app.set('views', 'src/views');
  app.set('view engine', 'pug');

  // real app should never enter this block
  if (testHacks && testHacks.middlewares) {
    for (const testHackMiddleware of testHacks.middlewares) {
      app.use(testHackMiddleware);
    }
  }

  app.use(express.static('public'));
  app.use(morgan('common'));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
        path: '/',
        secure: false,
      },
      store: store,
      name: 'movie-app-session-id',
      resave: false,
      saveUninitialized: true,
      secret: 'this is not very secure',
    }),
  );
  app.use(flash());
  //middleware for flash messages before a redirect
  app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
  });

  // create handlers
  const homeHandler = new HomeHandler();
  const moviesHandler = new MoviesHandler({ moviesService });
  const reviewsHandler = new ReviewsHandler({ reviewsService });
  const usersHandler = new UsersHandler({ usersService });

  // register handlers to routes
  app.get('/', homeHandler.try(homeHandler.getHomePage));

  //movies
  app.get(
    '/movies',
    [parseTitleQuery, parseYearQuery, parseRuntimeQuery],
    moviesHandler.try(moviesHandler.getAllMovies),
  );

  app.get('/movies/create', moviesHandler.try(moviesHandler.createMovie));
  app.post(
    '/movies/create',
    [parseTitle, parseYear, parseRuntime],
    moviesHandler.try(moviesHandler.createMoviePost),
  );
  app.get('/movies/:id', moviesHandler.try(moviesHandler.getMovie));
  app.get('/movies/update/:id', moviesHandler.try(moviesHandler.updateMovie));
  app.post(
    '/movies/update/:id',
    [parseTitle, parseYear, parseRuntime],
    moviesHandler.try(moviesHandler.updateMoviePost),
  );
  app.post('/movies/delete/:id', moviesHandler.try(moviesHandler.deleteMovie));

  //reviews
  app.get('/reviews', reviewsHandler.try(reviewsHandler.getAllReviews));
  app.get('/reviews/create', requireAuth, reviewsHandler.try(reviewsHandler.reviewMovie));
  app.post(
    '/reviews/create',
    requireAuth,
    [parseTitle, parseReviewer, parseGrade, parseComments],
    reviewsHandler.try(reviewsHandler.reviewMoviePost),
  );

  app.get('/reviews/:id', reviewsHandler.try(reviewsHandler.getReview));
  app.get('/movies/:id/reviews', reviewsHandler.try(reviewsHandler.getAllReviewsOfOneMovie));
  app.get(
    '/reviews/reviewers/:reviewer',
    reviewsHandler.try(reviewsHandler.getAllReviewsByOneReviewer),
  );

  app.get('/reviews/update/:id', requireAuth, reviewsHandler.try(reviewsHandler.updateReview));
  app.post(
    '/reviews/update/:id',
    requireAuth,
    [parseReviewer, parseGrade, parseComments],
    reviewsHandler.try(reviewsHandler.updateReviewPost),
  );
  app.post('/reviews/delete/:id', requireAuth, reviewsHandler.try(reviewsHandler.deleteReview));

  //users
  app.get('/signUp', usersHandler.try(usersHandler.signUp));
  app.post(
    '/signUp',
    [parseUsername, parseEmail, parsePassword, parsePasswordConfirmation],
    usersHandler.try(usersHandler.signUpPost),
  );

  app.get('/signIn', usersHandler.try(usersHandler.signIn));
  app.post(
    '/signIn',
    [parseUsername, parseEmail, parsePassword],
    usersHandler.try(usersHandler.signInPost),
  );
  app.post('/signOut', usersHandler.try(usersHandler.signOut));

  //error-handler for non-existing paths
  app.use((err, req, res, _next) => {
    console.log(err);
    res.status(404).send(err.message);
  });

  return app;
};

module.exports = { AppFactory, store };
