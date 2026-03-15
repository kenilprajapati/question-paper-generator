const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: [true, 'Question text is required'] 
    },
    type: { 
        type: String, 
        required: [true, 'Question type is required'],
        enum: ['MCQ', 'Descriptive', 'True / False']
    },
    unit: { 
        type: String, 
        required: [true, 'Unit number is required'] 
    },
    marks: { 
        type: Number, 
        required: [true, 'Marks are required'] 
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: [true, 'Question must belong to a subject']
    },
    year: { 
        type: String, 
        default: new Date().getFullYear().toString() 
    },
    options: {
        a: String,
        b: String,
        c: String,
        d: String
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Question', questionSchema);
