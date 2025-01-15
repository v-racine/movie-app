class ErrMovieAlreadyExists extends Error {
  constructor() {
    super('Movie already exists');
  }
}

class ErrMovieNotFound extends Error {
  constructor() {
    super('Movie not found');
  }
}

class MovieService {
  constructor(args) {
    this.moviesRepo = args.moviesRepo;
  }

  async getAllMovies(queryStrings) {
    const arrOfMovieObjs = await this.moviesRepo.getAll(queryStrings);

    const idAndTitles = arrOfMovieObjs.map((movieObject) => {
      return {
        id: movieObject.id,
        title: movieObject.movie_title,
      };
    });

    return idAndTitles;
  }

  async getMovie(id) {
    const existingMovie = await this.moviesRepo.getOne(id);
    if (!existingMovie) {
      throw new ErrMovieNotFound();
    }

    return existingMovie;
  }

  async deleteMovie(id) {
    await this.moviesRepo.delete(id);
  }

  async createMovie(title, year, runTime) {
    const existingMovie = await this.moviesRepo.getOneBy({ movie_title: title });
    if (existingMovie) {
      throw new ErrMovieAlreadyExists();
    }

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
  ErrMovieAlreadyExists,
};
