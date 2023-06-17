const userRoutes = require('express').Router();

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationGetCurrentUser,
  validationUpdateUser,
} = require('../middlewares/validation');

userRoutes.get('/users', validationGetCurrentUser, getCurrentUser);
userRoutes.patch('/users/me', validationUpdateUser, updateUser);

module.exports = userRoutes;
