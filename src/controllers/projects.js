const Project = require('../models/Project');
const Workspace = require('../models/Workspace');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ owner: req.user.id });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user is project owner
        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to access this project' });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;

        // Map frontend workspaceId to backend workspace field
        if (req.body.workspaceId) {
            req.body.workspace = req.body.workspaceId;
        }

        const project = await Project.create(req.body);

        // Update workspace to include this project
        if (req.body.workspace) {
            await Workspace.findByIdAndUpdate(req.body.workspace, {
                $push: { projects: project._id }
            });
        }

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user is project owner
        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user is project owner
        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

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
