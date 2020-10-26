const apiRouter = require('express').Router();

const {
  createUser,
} = require('../controllers/users');

apiRouter.post('/signup/', createUser);
// router.get('/cards', getAllCards);

module.exports = { apiRouter };
