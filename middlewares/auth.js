const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('./configs');

// const JWT_SECRET = '2a1e5f1bdda397772d97265e726a851feb5f59498a5fc03ca904f7f42b9da95b';
// const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization); это ок
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  // console.log(token); это тоже ок
  try {
    payload = jwt.verify(token, JWT_SECRET);
    // console.log(payload); id user
  } catch (err) {
    throw new UnauthorizedError({ message: 'С токеном что-то не так' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
