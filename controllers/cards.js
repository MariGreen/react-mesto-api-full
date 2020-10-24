const Card = require('../models/card');

const getAllCards = (req, res) => Card.find({})
  .then((data) => {
    if (!data) {
      res
        .status(404)
        .send({ message: 'Запрашиваемый ресурс не найден' });
      return;
    }
    res
      .status(200)
      .send(data);
  })
  .catch(() => {
    res
      .status(500)
      .send({ message: 'Внутренняя ошибка сервера' });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({
    name, link, owner,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.body)
    .orFail(new Error('NoCard'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NoCard') {
        res.status(404).send({ message: 'Карточки нет в базе' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard,
};
