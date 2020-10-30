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

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate({ _id: req.params._id },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .orFail(new Error('NoCard'))
    .catch((err) => {
      if (err.message === 'NoCard') {
        throw new NotFoundError('Карточки с таким id нет в базе');
      }
    })
    .then((card) => res.send(card.likes))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate({ _id: req.params._id },
    { $pull: { likes: req.user._id } }, // убрать _id, если есть
    { new: true }
      .orFail(new Error('NoCard'))
      .catch((err) => {
        if (err.message === 'NoCard') {
          throw new NotFoundError('Карточки с таким id нет в базе');
        }
      })
      .then((card) => res.send(card))
      .catch(next));
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
