class MovieService {
  constructor(args) {
    this.moviesRepo = args.moviesRepo;
  }

  async getAllMovies() {
    return await this.moviesRepo.getAll();
  }
}

module.exports = {
  MovieService,
};
