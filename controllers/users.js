const bcrypt = require('bcryptjs');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('./constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Такого пользователя нет в базе' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password, {runValidators: true})
  .then((user) => {
    const token = jwt.sign(
     { _id: user._id },
     'super-strong-secret',
     { expiresIn: '7d' });
    res.cookie('jwt', token, {
       maxAge: 3600000 * 24 * 7,
       httpOnly: true,
       sameSite: true,
     })
   res.send({ token });
   })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
      }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        password: hash,
       });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'Illegal arguments: undefined, number') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      if (err.code === 11000) {
        res.status(409).send({ message: 'Уже есть в базе, дружок' }); //поменять
    }
      else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.name });
      }
    });
};

const upgradeUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const upgradeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.name });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserId,
  upgradeUser,
  upgradeUserAvatar,
  login,
};
