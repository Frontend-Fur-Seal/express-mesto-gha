const router = require('express').Router();
const { getUsers, createUser } = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', createUser);

module.exports = router;
