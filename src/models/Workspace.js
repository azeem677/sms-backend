const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['ADMIN', 'MEMBER'],
                default: 'MEMBER'
            }
        }
    ],
    projects: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Project'
        }
    ],
    image_url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workspace', workspaceSchema);
