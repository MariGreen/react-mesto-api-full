const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя нужно'],
    minlength: 2,
    maxlength: 30,
    default: 'Господин Введи-Свое-Имя',
  },
  about: {
    type: String,
    required: [true, 'Поле не должно быть пустым'],
    minlength: 2,
    maxlength: 30,
    default: 'Пара слов о себе',
  },
  avatar: {
    type: String,
    required: [true, 'Ссылка должна быть'],
    validate: {
      validator(link) {
        // eslint-disable-next-line no-useless-escape
        // return /^(https?:\/\/)?(w{3}\.)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?\#?$/.test(v);
        return validator.isURL(link);
      },
      message: 'Ссылка не валидна',
    },
    default: 'https://i.pinimg.com/736x/9c/55/52/9c555272afa158796052ed1c78e68e95.jpg',
  },
  email: {
    type: String,
    required: [true, 'Почта нужна'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Без пароля никак'],
    minlength: 8,
    select: false,
  },
},

{ versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
