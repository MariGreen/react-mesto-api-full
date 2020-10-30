const router = require('express').Router();
const { validateId, validateCard } = require('../middlewares/requestsValidation');

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards', validateCard, createCard);

router.delete('/cards', validateId, deleteCard);

router.put('/cards/:_id/likes', validateId, likeCard);

router.delete('/cards/:_id/likes', validateId, dislikeCard);

module.exports = {
  router,
};
