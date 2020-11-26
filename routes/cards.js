const router = require('express').Router();
const { validateId, validateCard } = require('../middlewares/requestsValidation');

const {
  getAllCards, createCard, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.get('/cards/:_id', getCard);

router.post('/cards', createCard);

router.delete('/cards', validateId, deleteCard);

router.put('/cards/:_id/likes', validateId, likeCard);

router.delete('/cards/:_id/likes', validateId, dislikeCard);

module.exports = {
  router,
};
