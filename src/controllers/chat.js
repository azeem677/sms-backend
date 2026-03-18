const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort('createdAt');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get recent chats (users)
// @route   GET /api/chat/recent
// @access  Private
exports.getRecentChats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find latest message for each conversation
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .sort({ createdAt: -1 });

        const recentChatUserIds = new Set();
        const recentChats = [];

        for (const msg of messages) {
            const otherUserId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();

            if (!recentChatUserIds.has(otherUserId)) {
                recentChatUserIds.add(otherUserId);

                const otherUser = await User.findById(otherUserId).select('name email');
                if (otherUser) {
                    recentChats.push({
                        user: otherUser,
                        lastMessage: msg
                    });
                }
            }

            // Limit to 20 recent chats
            if (recentChats.length >= 20) break;
        }

        res.status(200).json({
            success: true,
            data: recentChats
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all users for chat list
// @route   GET /api/chat/users
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users except the currently logged in user
        const users = await User.find({ _id: { $ne: req.user.id } }).select('name email');

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

