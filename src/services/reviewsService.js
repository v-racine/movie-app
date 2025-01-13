class ErrReviewNotFound extends Error {
  constructor() {
    super('Review not found');
  }
}

class ErrReviewAlreadyExists extends Error {
  constructor() {
    super('A review of this movie was already submitted by the reviewer.');
  }
}

class ReviewsService {
  constructor(args) {
    this.reviewsRepo = args.reviewsRepo;
  }

  async getAllReviews() {
    const arrOfReviewObjs = await this.reviewsRepo.getAll();

    const reviewInfo = arrOfReviewObjs.map((reviewObject) => {
      return {
        id: reviewObject.id,
        reviewer: reviewObject.reviewer,
        grade: reviewObject.grade,
        comments: reviewObject.comments,
        movie: reviewObject.movie_title,
      };
    });

    return reviewInfo;
  }

  async getReview(id) {
    const existingReview = await this.reviewsRepo.getOne(id);
    if (!existingReview) {
      throw new ErrReviewNotFound();
    }

    return existingReview;
  }

  async getAllReviewsOfOneMovie(movieId) {
    const arrOfReviewObjs = await this.reviewsRepo.getAllReviewsOfOneMovie(movieId);

    const reviewInfo = arrOfReviewObjs.map((reviewObject) => {
      return {
        id: reviewObject.id,
        reviewer: reviewObject.reviewer,
        grade: reviewObject.grade,
        comments: reviewObject.comments,
        movie: reviewObject.movie_title,
      };
    });

    return reviewInfo;
  }

  async getAllReviewsByOneReviewer(reviewer) {
    const arrOfReviewObjs = await this.reviewsRepo.getAllReviewsByOneReviewer(reviewer);

    const reviewInfo = arrOfReviewObjs.map((reviewObject) => {
      return {
        id: reviewObject.id,
        reviewer: reviewObject.reviewer,
        grade: reviewObject.grade,
        comments: reviewObject.comments,
        movie: reviewObject.movie_title,
      };
    });

    return reviewInfo;
  }

  async reviewMovie(reviewer, grade, comments, movieId) {
    const existingReview = await this.reviewsRepo.getOneBy({ reviewer, movieId });
    if (existingReview) {
      throw new ErrReviewAlreadyExists();
    }

    await this.reviewsRepo.create({ reviewer, grade, comments });
  }

  async updateReview(id, attrs) {
    const existingReview = await this.reviewsRepo.getOne(id);
    if (!existingReview) {
      throw new ErrReviewNotFound();
    }

    Object.assign(existingReview, attrs);

    await this.reviewsRepo.update(id, existingReview);
  }

  async deleteReview(id) {
    await this.reviewsRepo.delete(id);
  }
}

module.exports = { ReviewsService, ErrReviewAlreadyExists, ErrReviewNotFound };
