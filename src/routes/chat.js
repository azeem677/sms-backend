const express = require('express');
const { getMessages, getRecentChats, getAllUsers } = require('../controllers/chat');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/users', getAllUsers);
router.get('/recent', getRecentChats);
router.get('/:userId', getMessages);

module.exports = router;

