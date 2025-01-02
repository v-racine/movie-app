class MoviesHandler {
  constructor(args) {
    this.moviesService = args.moviesService;

    this.getAllMovies = this.getAllMovies.bind(this);
    this.getMovie = this.getMovie.bind(this);
    this.createMovie = this.createMovie.bind(this);
    this.createMoviePost = this.createMoviePost.bind(this);
    this.updateMovie = this.updateMovie.bind(this);
    this.updateMoviePost = this.updateMoviePost.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
  }

  async getAllMovies(req, res) {
    const movies = await this.moviesService.getAllMovies();
    res.render('movie-list', { movies });
  }

  async getMovie(req, res) {
    const movie = await this.moviesService.getMovie(req.params.id);
    res.render('movie', { movie });
  }

  async createMovie(req, res) {}

  async createMoviePost(req, res) {}

  async updateMovie(req, res) {}

  async updateMoviePost(req, res) {}

  async deleteMovie(req, res) {}
}

module.exports = { MoviesHandler };
