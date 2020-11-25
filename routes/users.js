const router = require('express').Router();
const { validateId, validateUserUpdate, validateUserAvatar } = require('../middlewares/requestsValidation');

const {
  getAllUsers,
  getUserById,
  updateUser, updateUserAvatar, getUserByToken,

} = require('../controllers/users');

router.get('/users/:_id', validateId, getUserById);

router.get('/users', getAllUsers);

router.get('/me', getUserByToken);

router.patch('/users/me', validateUserUpdate, updateUser);

router.patch('/users/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = {
  router,
};
