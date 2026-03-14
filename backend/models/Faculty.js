const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Pending', 'Revoked'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
