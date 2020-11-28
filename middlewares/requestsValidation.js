const { celebrate, Joi } = require('celebrate');

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/^(https?:\/\/)?(w{3}\.)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?\#?$/),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(8).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().alphanum().min(8),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(8).max(30).required(),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/).required(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/).required(),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateId,
  validateUserUpdate,
  validateUserAvatar,
  validateCard,
};
