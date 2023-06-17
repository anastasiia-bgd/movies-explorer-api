const router = require('express').Router();
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const {
  createUser,
  login,
} = require('../controllers/users');
const { validationSignin, validationCreateUser } = require('../middlewares/validation');
const NotFound = require('../errors/NotFound');

router.post('/signin', validationSignin, login);
router.post('/signup', validationCreateUser, createUser);

router.use('/', auth, usersRouter);
router.use('/', auth, moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('404: Not Found'));
});

module.exports = router;
