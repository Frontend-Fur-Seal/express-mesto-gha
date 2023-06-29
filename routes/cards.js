const router = require('express').Router();

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const { validationCreateCard } = require('../middlewares/celebrateValidation')

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
