const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const userSchema = require('../models/user');

const { JWT_SECRET } = require('../config');
const ConflictError = require('../errors/Conflict');

module.exports.getUserById = (req, res, next) => {
  userSchema.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('User with such id is not found'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    password,
    name,
    email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userSchema.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201)
      .send({
        name: user.name,
        email: user.email,
        _id: user._id,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Incorrect data'));
      } else if (err.name === 11000) {
        next(new ConflictError('This user is already registered'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  userSchema.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};
