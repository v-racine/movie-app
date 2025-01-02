class MovieService {
  constructor(args) {
    this.moviesRepo = args.moviesRepo;
  }

  async getAllMovies() {
    const arrOfMovieObjs = await this.moviesRepo.getAll();
    const arrOfMovies = arrOfMovieObjs.map((movieObject) => [
      movieObject.id,
      movieObject.movie_title,
    ]);

    return arrOfMovies;
  }

  async getMovie(id) {
    const movieObj = await this.moviesRepo.getOne(id);

    console.log(movieObj);
    return movieObj;
  }
}

module.exports = {
  MovieService,
};
