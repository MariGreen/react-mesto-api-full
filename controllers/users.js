const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const { NODE_ENV, JWT_SECRET } = process.env;

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
  const { password, email } = req.body;

  bcrypt.hash(password, 10)
    .then((hashPassword) => {
      User.create({ password: hashPassword, email })
        .then((user) => res.status(200).send({ _id: user._id }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: err });
          } else {
            res.status(500).send({ message: 'Ошибка сервера' });
          }
        });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      // res.cookie('jwt', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true,
      //   sameSite: true,
      // })
      // .end();
      res.status(200).send({ token });
    })
    .catch((err) => {
    // ошибка аутентификации
      res.status(401)
        .send({ message: err.message });
    });
};

const updateUser = (req, res, user) => { // убрать юзера
  const { name, about } = req.body;

  User.findOneAndUpdate({ name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    .then(() => res.status(200).send(user))
    .catch((err) => {
      res.status(404)
        .send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(avatar, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    .then((user) => res.status(200).send(user))// убрать юзера
    .catch((err) => {
      res.status(404)
        .send({ message: err.message });
    });
};

module.exports = {
  getAllUsers, getUserById, createUser, updateUser, updateUserAvatar, login,
};
