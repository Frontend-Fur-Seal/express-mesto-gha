const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  Card.create(newCardData)
    .then((newCard) => newCard.populate('owner'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        res.status(403).send({ message: 'Нет прав' });
        return;
      }
      Card.findByIdAndRemove(cardId)
        .then((delCard) => {
          res.send(delCard);
        });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Такой карточки нет в базе'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные карточки'));
      }
      next(err);
    });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Такой карточки нет в базе'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные карточки'));
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Такой карточки нет в базе'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные карточки'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
