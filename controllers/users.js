const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError.js');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

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

const createUser = (req, res, next) => {
  const { password, email } = req.body;
  if (!(email && password)) {
    return res.status(400).send({ message: 'Почта и пароль нужны оба' });
  }
  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    if (error) {
      return res.status(500).send({ message: 'Не удалось создать пользователя' });
    }
    return User.findOne({ email })
      .then((usr) => {
        if (usr) {
          return next(new ConflictError('Пользователь с таким email уже есть'));
        }
        return User.create(({ email, password: hash }))
          .then((user) => res.status(200).send({ message: `Пользователь ${user.email} успешно создан. Id: ${user._id}` }))
          .catch(() => res.status(500).send({ message: 'Не удалось создать пользователя' }));
      })
      .catch(() => res.status(500).send({ message: 'Не удалось проверить уникальность пользователя' }));
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).send({ message: 'Почта и пароль нужны оба' });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Такого пользователя не существует' });
      }

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET', { expiresIn: '7d' });

      return res.status(200).send({ message: `Мы вас нашли, ваш токен — ${token}` });
    })
    .catch(() => res.status(500).send({ message: 'Не удалось найти пользователя' }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(404)
        .send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(404)
        .send({ message: err.message });
    });
};

module.exports = {
  getAllUsers, getUserById, createUser, updateUser, updateUserAvatar, login,
};
