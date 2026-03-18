const Task = require('../models/Task');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// @desc    Get all tasks
// @route   GET /api/tasks
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        let query;

        if (req.params.projectId) {
            query = Task.find({ project: req.params.projectId }).populate({
                path: 'assignee',
                select: 'name email'
            });
        } else {
            query = Task.find().populate({
                path: 'project',
                select: 'name description'
            }).populate({
                path: 'assignee',
                select: 'name email'
            });
        }

        const tasks = await query;

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate({
                path: 'project',
                select: 'name description status priority startDate progress'
            })
            .populate({
                path: 'assignee',
                select: 'name email'
            });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        // Handle project ID from URL or body
        const projectId = req.params.projectId || req.body.projectId || req.body.project;

        if (!projectId) {
            return res.status(400).json({ success: false, error: 'Please provide a project ID' });
        }

        // Validate if projectId is a valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ success: false, error: 'Invalid project ID format. If this is a dummy project, please create a real project from the Projects page first.' });
        }

        req.body.project = projectId;
        req.body.owner = req.user.id;

        // If assignee is provided, validate it (handle empty string/null cases from frontend)
        if (req.body.assignee && req.body.assignee !== '' && req.body.assignee !== 'null') {
            if (!mongoose.Types.ObjectId.isValid(req.body.assignee)) {
                return res.status(400).json({ success: false, error: 'Invalid assignee user ID. Please select a real user from the list.' });
            }
        } else {
            req.body.assignee = null;
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found in database' });
        }

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error("Task Creation Error:", error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate({
            path: 'assignee',
            select: 'name email'
        });

        if (req.io) {
            req.io.emit('taskUpdated', task);
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
