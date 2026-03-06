const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projects');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router
    .route('/')
    .get(getProjects)
    .post(createProject);

router
    .route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
