class MovieService {
  constructor(args) {
    this.moviesRepo = args.moviesRepo;
  }

  async getAllMovies() {
    const arrOfMovieObjs = await this.moviesRepo.getAll();
    const arrOfMovieTitles = arrOfMovieObjs.map((movieObject) => movieObject.movie_title);

    return arrOfMovieTitles;
  }
}

module.exports = {
  MovieService,
};
