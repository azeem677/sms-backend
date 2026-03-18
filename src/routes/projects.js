const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projects');

// Include other resource routers
const taskRouter = require('./tasks');

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/tasks', taskRouter);

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
