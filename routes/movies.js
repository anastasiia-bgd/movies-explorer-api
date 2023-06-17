const movieRoutes = require('express').Router();
const {
  validationCreateMovie,
  validationDeleteMovie,
} = require('../middlewares/validation');

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

movieRoutes.get('/movies', getMovies);
movieRoutes.delete('/movies/:movieId', validationDeleteMovie, deleteMovie);
movieRoutes.post('/movies', validationCreateMovie, createMovie);

module.exports = movieRoutes;
