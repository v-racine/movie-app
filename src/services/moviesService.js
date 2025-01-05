class ErrMovieNotFound extends Error {
  constructor() {
    super('Movie not found');
  }
}

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

  async createMovie(title, year, runTime) {
    await this.moviesRepo.create({
      title,
      year,
      runTime,
    });
  }

  async updateMovie(id, attrs) {
    const existingMovie = await this.moviesRepo.getOne(id);
    if (!existingMovie) {
      throw new ErrMovieNotFound();
    }

    Object.assign(existingMovie, attrs);

    await this.moviesRepo.update(id, existingMovie);
  }
}

module.exports = {
  MovieService,
  ErrMovieNotFound,
};
