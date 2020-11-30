const router = require('express').Router();
const { validateId, validateCard, validateCardId } = require('../middlewares/requestsValidation');

const {
  getAllCards, createCard, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.get('/cards/:_id', getCard);

router.post('/cards', validateCard, createCard);

router.delete('/cards/:_id', validateCardId, deleteCard);

router.put('/cards/:_id/likes', validateId, likeCard);

router.delete('/cards/:_id/likes', validateId, dislikeCard);

module.exports = {
  router,
};
