const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const linkValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректная ссылка');
  }
};

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().custom(linkValidation),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(8).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
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
    avatar: Joi.string().required(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().custom(linkValidation),
  }),
});

const validateCardDelete = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().custom(linkValidation),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateId,
  validateUserUpdate,
  validateUserAvatar,
  validateCard,
  validateCardDelete,
};
