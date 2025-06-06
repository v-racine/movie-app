const { BaseHandler } = require('./baseHandler');
const { ErrMovieNotFound, ErrMovieAlreadyExists } = require('../services/moviesService');
const { validationResult } = require('express-validator');

class MoviesHandler extends BaseHandler {
  constructor(args) {
    super();
    this.moviesService = args.moviesService;

    this.getAllMovies = this.getAllMovies.bind(this);
    this.getMovie = this.getMovie.bind(this);
    this.createMovie = this.createMovie.bind(this);
    this.createMoviePost = this.createMoviePost.bind(this);
    this.updateMovie = this.updateMovie.bind(this);
    this.updateMoviePost = this.updateMoviePost.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
  }

  async getAllMovies(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('home', {
        flash: req.flash(),
      });
    }

    const movies = await this.moviesService.getAllMovies(req.query);
    return res.render('movie-list', { movies });
  }

  async getMovie(req, res) {
    let movie;

    try {
      movie = await this.moviesService.getMovie(req.params.id);
    } catch (err) {
      if (err instanceof ErrMovieNotFound) {
        return res.render('new-movie', { err });
      } else {
        console.log(`failed to find the movie: ${err}`);
        return res.render('home', { oops: true });
      }
    }

    return res.render('movie', { movie });
  }

  async createMovie(req, res) {
    return res.render('new-movie');
  }

  async createMoviePost(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('new-movie', {
        flash: req.flash(),
        title: req.body.title,
        year: req.body.year,
        runTime: req.body.runTime,
      });
    }

    const { title, year, runTime } = req.body;

    try {
      await this.moviesService.createMovie(title, year, runTime);
    } catch (err) {
      if (err instanceof ErrMovieAlreadyExists) {
        console.log(err);
        return res.render('new-movie', { err });
      } else {
        console.log(`failed to create new movie: ${err}`);
        return res.render('new-movie', { oops: true });
      }
    }

    req.flash('success', 'Movie added!');
    res.redirect('/movies');
  }

  async updateMovie(req, res) {
    let movie;
    try {
      movie = await this.moviesService.getMovie(req.params.id);
    } catch (err) {
      if (err instanceof ErrMovieNotFound) {
        return res.render('new-movie', { err });
      } else {
        console.log(`failed to view update form: ${err}`);
        return res.render('movie', { oops: true, movie, id: req.params.id });
      }
    }

    return res.render('edit-movie', { movie, id: req.params.id });
  }

  async updateMoviePost(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('edit-movie', {
        flash: req.flash(),
        id: req.params.id,
        title: req.body.title,
        year: req.body.year,
        runTime: req.body.runTime,
      });
    }

    try {
      await this.moviesService.updateMovie(req.params.id, req.body);
    } catch (err) {
      if (err instanceof ErrMovieNotFound) {
        return res.render('new-movie', { err });
      } else {
        console.log(`failed to update the movie: ${err}`);
        return res.render('edit-movie', { oops: true, id: req.params.id });
      }
    }

    req.flash('success', 'Movie updated!');
    res.redirect('/movies');
  }

  async deleteMovie(req, res) {
    try {
      await this.moviesService.deleteMovie(req.params.id);
    } catch (err) {
      if (err instanceof Error) {
        console.log(`failed to delete movie: ${err.message}`);
        return res.render('home', { oops: true, id: req.params.id });
      }
    }

    res.redirect('/movies');
  }
}

module.exports = { MoviesHandler };
