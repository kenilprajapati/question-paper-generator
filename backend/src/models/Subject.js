const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Subject code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    semester: {
        type: Number,
        required: [true, 'Semester is required']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Subject must be created by a user']
    }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
