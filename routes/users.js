const router = require('express').Router();
const { getUsers, getUserId, createUser } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserId);

module.exports = router;
