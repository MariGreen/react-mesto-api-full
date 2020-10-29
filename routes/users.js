const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateUser, updateUserAvatar,

} = require('../controllers/users');

router.get('/users/:_id', getUserById);

router.get('/users', getAllUsers);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = {
  router,
};
