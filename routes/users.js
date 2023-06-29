const router = require('express').Router();

const {
  getUsers, getUserId, upgradeUser, upgradeUserAvatar, getUser
} = require('../controllers/users');

const { validationUserId, validationUpgradeUser, validationUpgradeAvatar } = require('../middlewares/celebrateValidation')

router.get('/me', getUser);
router.get('/', getUsers);
router.get('/:userId', validationUserId, getUserId);
router.patch('/me', validationUpgradeUser, upgradeUser);
router.patch('/me/avatar', validationUpgradeAvatar, upgradeUserAvatar);

module.exports = router;
