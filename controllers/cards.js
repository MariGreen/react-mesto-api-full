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

const getCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(() => new NotFoundError('Карточки нет в базе'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

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
      if (card.owner.toString() === req.user._id.toString()) {
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
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findById({ _id: req.params._id })
  // убрать _id, если есть
    .then(Card.updateOne({ _id: req.params }, { $pull: { likes: req.user._id } },
      { new: true })
      .catch((err) => console.log(err)))
    .then((card) => res.send(card))
    .catch(next);
};

// const hearts = (req, res, next) => {
//   Card.findById(req.params._id)
//     .then((card) => {
//       const userId = req.params._id;
//       console.log(typeof userId);
//       if (card.likes.includes(userId)) {
//         console.log(card.likes);
//         Card.updateOne({ _id: req.params }, { $pull: { likes: req.user._id } },
//           { new: true });
//       } else if {
//         Card.findByIdAndUpdate({ _id: req.params._id },
//           { $addToSet: { likes: req.user._id } },
//           { new: true });
//       } else{

//       }
//     })
//     .then((card) => res.send(card))
//     .catch(next);
// };

module.exports = {
  getAllCards, createCard, getCard, deleteCard, likeCard, dislikeCard,
};
