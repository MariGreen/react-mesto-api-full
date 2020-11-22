const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(`${authorization}authorization`);
  if (!authorization || !authorization.startsWith('Bearer')) {
    console.log(`${res}resauth`);
    return res.status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET');
    console.log(`${payload}payload`);
  } catch (err) {
    throw new UnauthorizedError({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  console.log(`${req.user}req.user`);
  return next();
};
