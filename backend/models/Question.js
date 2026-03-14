const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, required: true }, // MCQ, Descriptive, True / False
    unit: { type: String, required: true },
    marks: { type: Number, required: true },
    year: { type: String, default: "2026" },
    options: {
        a: String,
        b: String,
        c: String,
        d: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
