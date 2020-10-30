const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/NotFoundError');

const getAllCards = (req, res, next) => Card.find({})
  .then((data) => {
    res
      .status(200)
      .send(data);
  })
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({
    name, link, owner,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.body)
    .orFail(new Error('NoCard'))
    .catch((err) => {
      if (err.message === 'NoCard') {
        throw new NotFoundError('Карточки нет в базе');
      }
    })
    .then((card) => {
      if (card.owner === req.user._id) {
        Card.findOneAndDelete({ _id: card._id })
          .then(() => {
            res.status(200).send({ data: card });
          });
      } else {
        throw new ForbiddenError('Можно удалить только свой контент');
      }
    })
    .catch(next);
};

module.exports = {
  getAllCards, createCard, deleteCard,
};
