const Workspace = require('../models/Workspace');

// @desc    Get all workspaces for current user
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res, next) => {
    try {
        // Find workspaces where user is owner or a member
        const workspaces = await Workspace.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        }).populate('members.user', 'name email').populate('projects');

        res.status(200).json({
            success: true,
            count: workspaces.length,
            data: workspaces
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;

        // Add owner as the first admin member
        req.body.members = [{
            user: req.user.id,
            role: 'ADMIN'
        }];

        const workspace = await Workspace.create(req.body);

        res.status(201).json({
            success: true,
            data: workspace
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
