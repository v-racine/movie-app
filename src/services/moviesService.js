class MovieService {
  constructor(args) {
    this.moviesRepo = args.moviesRepo;
  }
}

module.exports = {
  MovieService,
};
