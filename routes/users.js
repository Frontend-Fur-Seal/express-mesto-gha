const router = require('express').Router();
const {
  getUsers, getUserId, upgradeUser, upgradeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.patch('/me', upgradeUser);
router.patch('/me/avatar', upgradeUserAvatar);

module.exports = router;
