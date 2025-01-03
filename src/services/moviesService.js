class MovieService {
  constructor(args) {
    this.moviesRepo = args.moviesRepo;
  }

  async getAllMovies() {
    const arrOfMovieObjs = await this.moviesRepo.getAll();

    const idAndTitles = arrOfMovieObjs.map((movieObject) => {
      return {
        id: movieObject.id,
        title: movieObject.movie_title,
      };
    });

    return idAndTitles;
  }

  async getMovie(id) {
    const movieObj = await this.moviesRepo.getOne(id);

    return movieObj;
  }

  async deleteMovie(id) {
    await this.moviesRepo.delete(id);
  }
}

module.exports = {
  MovieService,
};
