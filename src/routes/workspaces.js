const express = require('express');
const { getWorkspaces, createWorkspace } = require('../controllers/workspaces');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getWorkspaces)
    .post(createWorkspace);

module.exports = router;
