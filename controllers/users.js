const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;
// const JWT_SECRET = 'ooo!';

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

// const createUser1 = (req, res) => {
//   const { password, email } = req.body;

//   bcrypt.hash(password, SALT_ROUNDS)
//     .then((hashPassword) => {
//       User.create({ password: hashPassword, email })
//         .then((user) => res.status(200).send({ _id: user._id }))
//         .catch((err) => {
//           if (err.name === 'ValidationError') {
//             res.status(400).send({ message: err });
//           } else {
//             res.status(500).send({ message: 'Ошибка сервера' });
//           }
//         });
//     });
// };

const createUser = (req, res) => {
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
          return res.status(409).send({ message: 'Такой пользователь уже существует' });
        }
        return User.create(({ email, password: hash }))
          .then((user) => res.status(200).send({ message: `Пользователь ${user.email} успешно создан. Id: ${user._id}` }))
          .catch(() => res.status(500).send({ message: 'Не удалось создать пользователя' }));
      })
      .catch(() => res.status(500).send({ message: 'Не удалось проверить уникальность пользователя' }));
  });
};

// const login1 = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       // создаем токен
//       const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
//       // вернём токен
//       // res.cookie('jwt', token, {
//       //   maxAge: 3600000 * 24 * 7,
//       //   httpOnly: true,
//       //   sameSite: true,
//       // })
//       // .end();
//       res.status(200).send({ token });
//     })
//     .catch((err) => {
//     // ошибка аутентификации
//       res.status(401)
//         .send({ message: err.message });
//     });
// };

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

// const login = (req, res) => {
//   const { email, password } = req.body;
//   if (!(email && password)) {
//     return res.status(400).send({ message: 'Почта и пароль нужны оба' });
//   }
//   return User.findUserByCredentials({ email })
//     .then(async (user) => {
//       if (!user) {
//         return res.status(401).send({ message: 'Такого пользователя не существует' });
//       }

//       const isPasswordMatch = await bcrypt.compare(password, user.password);

//       if (!isPasswordMatch) {
//         return res.status(401).send({ message: 'Не удалось войти' });
//       }
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET);

//       return res.status(200).send({ message: `Мы вас нашли, ваш токен — ${token}` });
//     })
//     .catch(() => res.status(500).send({ message: 'Не удалось найти пользователя' }));
// };

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
