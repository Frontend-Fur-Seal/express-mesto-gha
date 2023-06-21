const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  Card.create(newCardData)
    .then((newCard) => newCard.populate('owner'))
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404)
          .send({ message: 'Такого пользователя нет в базе' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
  const { name, about } = req.body;
  return Card.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteLike = (req, res) => {
  const { avatar } = req.body;
  return Card.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
