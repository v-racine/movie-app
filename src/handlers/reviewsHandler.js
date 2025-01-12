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

    // this.reviewMovie = this.reviewMovie.bind(this);
    // this.reviewMoviePost = this.reviewMoviePost.bind(this);
    // this.updateReview = this.updateReview.bind(this);
    // this.updateReviewPost = this.updateReviewPost.bind(this);

    this.deleteReview = this.deleteReview.bind(this);
  }

  async getAllReviews(req, res) {
    const reviews = await this.reviewsService.getAllReviews();
    //TODO: improve the `reviews-lists` view
    res.render('reviews-list', { reviews });
  }

  async getReview(req, res) {
    let review;

    try {
      review = await this.reviewsService.getReview(req.params.id);
    } catch (err) {
      if (err instanceof ErrReviewNotFound) {
        //TODO: add a real view later (and then add a test)
        return res.send(err.message);
      } else {
        console.log(`failed to find the review: ${err}`);
        return res.send('Internal server error');
      }
    }

    res.render('review', { review });
  }

  async getAllReviewsOfOneMovie(req, res) {
    const reviews = await this.reviewsService.getAllReviewsOfOneMovie(req.params.id);
    res.render('reviews-list', { reviews });
  }

  async getAllReviewsByOneReviewer(req, res) {
    const reviewer = req.params.reviewer;
    const reviews = await this.reviewsService.getAllReviewsByOneReviewer(reviewer);
    res.render('reviews-list', { reviews });
  }

  async deleteReview(req, res) {
    try {
      await this.reviewsService.deleteReview(req.params.id);
    } catch (err) {
      if (err instanceof Error) {
        console.log(`failed to delete review: ${err.message}`);

        res.send('Internal Server Error');
        return;
      }
    }

    res.redirect('/reviews');
  }
}

module.exports = { ReviewsHandler };
