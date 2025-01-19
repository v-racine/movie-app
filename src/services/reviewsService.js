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

  async reviewMovie(title, reviewer, grade, comments, userId) {
    const existingReview = await this.reviewsRepo.getOneBy({ title, reviewer });
    if (existingReview) {
      throw new ErrReviewAlreadyExists();
    }

    await this.reviewsRepo.create({ title, reviewer, grade, comments, userId });
  }

  async updateReview(id, attrs, userId) {
    const existingReview = await this.reviewsRepo.getOne(id);
    if (!existingReview) {
      throw new ErrReviewNotFound();
    }

    Object.assign(existingReview, attrs);

    await this.reviewsRepo.update(id, existingReview, userId);
  }

  async deleteReview(id, userId) {
    await this.reviewsRepo.delete(id, userId);
  }
}

module.exports = { ReviewsService, ErrReviewAlreadyExists, ErrReviewNotFound };
