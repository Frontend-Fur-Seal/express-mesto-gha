const router = require('express').Router();
const {
  getUsers, getUserId, createUser, upgradeUser, upgradeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserId);
router.patch('/me', upgradeUser);
router.patch('/me/avatar', upgradeUserAvatar);

module.exports = router;
