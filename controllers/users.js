const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res) => User.find({})
  .then((data) => {
    if (!data) {
      res
        .status(404)
        .send({ message: 'Запрашиваемый ресурс не найден' });
      return;
    }
    res
      .status(200)
      .send(data);
  })
  .catch(() => {
    res
      .status(500)
      .send({ message: 'Внутренняя ошибка сервера' });
  });

const getUserById = (req, res) => User.findById(req.params._id)
  .orFail(new Error('NoUser'))
  .then((user) => {
    res.status(200)
      .send(user);
  })
  .catch((err) => {
    if (err.message === 'NoUser') {
      res.status(404)
        .send({ message: 'Такого пользователя не существует' });
    } else if (err.name === 'CastError') {
      res.status(400)
        .send({ message: 'Переданы некорректные данные' });
    }
    res.status(500)
      .send({ message: `Внутренняя ошибка сервера ${err}` });
  });

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
    // ошибка аутентификации
      res.status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getAllUsers, getUserById, createUser, login,
};
