const router = require('express').Router();
const { validateCard } = require('../middlewares/requestsValidation');

const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards', validateCard, createCard);

router.delete('/cards', deleteCard);

// PUT /cards/:cardId/likes
// DELETE /cards/:cardId/likes

module.exports = {
  router,
};
