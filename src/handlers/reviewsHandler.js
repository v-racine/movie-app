const { BaseHandler } = require('./baseHandler');
const { ErrReviewAlreadyExists, ErrReviewNotFound } = require('../services/reviewsService');
const { validationResult } = require('express-validator');

class ReviewsHandler extends BaseHandler {
  constructor(args) {
    super();
    this.reviewsService = args.reviewsService;

    this.getAllReviews = this.getAllReviews.bind(this);
    this.getReview = this.getReview.bind(this);
    this.getAllReviewsOfOneMovie = this.getAllReviewsOfOneMovie.bind(this);
    this.getAllReviewsByOneReviewer = this.getAllReviewsByOneReviewer.bind(this);

    this.reviewMovie = this.reviewMovie.bind(this);
    this.reviewMoviePost = this.reviewMoviePost.bind(this);

    this.updateReview = this.updateReview.bind(this);
    this.updateReviewPost = this.updateReviewPost.bind(this);

    this.deleteReview = this.deleteReview.bind(this);
  }

  async getAllReviews(req, res) {
    const reviews = await this.reviewsService.getAllReviews();
    return res.render('reviews-list', { reviews });
  }

  async getReview(req, res) {
    let review;

    try {
      review = await this.reviewsService.getReview(req.params.id);
    } catch (err) {
      if (err instanceof ErrReviewNotFound) {
        return res.render('new-review', { err });
      } else {
        console.log(`failed to find the review: ${err}`);
        return res.send('home', { oops: true });
      }
    }

    return res.render('review', { review });
  }

  async getAllReviewsOfOneMovie(req, res) {
    const reviews = await this.reviewsService.getAllReviewsOfOneMovie(req.params.id);
    return res.render('reviews-list', { reviews });
  }

  async getAllReviewsByOneReviewer(req, res) {
    const reviewer = req.params.reviewer;
    const reviews = await this.reviewsService.getAllReviewsByOneReviewer(reviewer);
    return res.render('reviews-list', { reviews });
  }

  async reviewMovie(req, res) {
    return res.render('new-review');
  }

  async reviewMoviePost(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('new-review', {
        flash: req.flash(),

        title: req.body.title,
        reviewer: req.body.reviewer,
        grade: req.body.grade,
        comments: req.body.comments,
      });
    }

    const { title, reviewer, grade, comments } = req.body;

    try {
      await this.reviewsService.reviewMovie(title, reviewer, grade, comments, req.session.userId);
    } catch (err) {
      if (err instanceof ErrReviewAlreadyExists) {
        console.log(err);
        return res.render('new-review', { err });
      } else {
        console.log(`failed to create new movie: ${err}`);
        return res.render('new-review', { oops: true });
      }
    }

    req.flash('success', 'Review added!');
    res.redirect('/reviews');
  }

  async updateReview(req, res) {
    let review;

    try {
      review = await this.reviewsService.getReview(req.params.id);
    } catch (err) {
      if (err instanceof ErrReviewNotFound) {
        return res.render('new-review', { err });
      } else {
        console.log(`failed to find the review: ${err}`);
        return res.render('review', { oops: true, review, id: req.params.id });
      }
    }

    return res.render('edit-review', { review, id: req.params.id });
  }

  async updateReviewPost(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('edit-review', {
        flash: req.flash(),

        id: req.params.id,
        reviewer: req.body.reviewer,
        grade: req.body.grade,
        comments: req.body.comments,
      });
    }

    try {
      await this.reviewsService.updateReview(req.params.id, req.body, req.session.userId);
    } catch (err) {
      if (err instanceof ErrReviewNotFound) {
        return res.render('new-review', { err });
      } else {
        console.log(`failed to find the review: ${err}`);
        return res.render('edit-review', { oops: true, id: req.params.id });
      }
    }

    req.flash('success', 'Review updated!');
    res.redirect('/reviews');
  }

  async deleteReview(req, res) {
    try {
      await this.reviewsService.deleteReview(req.params.id, req.session.userId);
    } catch (err) {
      if (err instanceof Error) {
        console.log(`failed to delete review: ${err.message}`);
        return res.render('home', { oops: true });
      }
    }

    res.redirect('/reviews');
  }
}

module.exports = { ReviewsHandler };
