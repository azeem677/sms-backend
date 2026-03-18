const express = require('express');
const { register, login, getAllUsers } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);

module.exports = router;
