const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getAllCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((data) => {
    res
      .status(200)
      .send(data);
  })
  .catch(next);

const getCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(() => new NotFoundError('Карточки нет в базе'))
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id).populate(['owner', 'likes'])
        .orFail(() => new NotFoundError('Не удалось создать карточку'))
        .then((item) => {
          res.status(200).send(item);
        });
    }).catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params._id).populate(['owner', 'likes'])
    .orFail(new Error('NoCard'))
    .catch((err) => {
      if (err.message === 'NoCard') {
        throw new NotFoundError('Карточки нет в базе');
      }
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id.toString()) {
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
    .populate(['owner', 'likes'])
    .orFail(new Error('NoCard'))
    .catch((err) => {
      if (err.message === 'NoCard') {
        throw new NotFoundError('Карточки с таким id нет в базе');
      }
    })
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate({ _id: req.params._id },
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .populate(['owner', 'likes'])
    .orFail(new Error('NoCard'))
    .catch((err) => {
      if (err.message === 'NoCard') {
        throw new NotFoundError('Карточки с таким id нет в базе');
      }
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getAllCards, createCard, getCard, deleteCard, likeCard, dislikeCard,
};
