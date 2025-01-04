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

  async createMovie(req, res) {
    res.render('new-movie');
  }

  async createMoviePost(req, res) {
    const { title, year, runTime } = req.body;

    try {
      await this.moviesService.createMovie(title, year, runTime);
    } catch (err) {
      console.log(`failed to create new product: ${err}`);
      return res.send('Internal server error');
    }

    res.redirect('/movies');
  }

  async updateMovie(req, res) {}

  async updateMoviePost(req, res) {}

  async deleteMovie(req, res) {
    try {
      await this.moviesService.deleteMovie(req.params.id);
    } catch (err) {
      if (err instanceof Error) {
        console.log(`failed to delete movie: ${err.message}`);

        res.send('Internal Server Error');
        return;
      }
    }

    res.redirect('/movies');
  }
}

module.exports = { MoviesHandler };
