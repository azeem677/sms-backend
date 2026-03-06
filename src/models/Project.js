const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['Planning', 'Active', 'Completed', 'On Hold'],
        default: 'Planning'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    projectLead: {
        type: String,
        default: 'No lead'
    },
    teamMembers: {
        type: [String],
        default: []
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    workspace: {
        type: mongoose.Schema.ObjectId,
        ref: 'Workspace'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
