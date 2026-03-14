const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// Get all faculty
router.get('/', async (req, res) => {
    try {
        const facultyMembers = await Faculty.find();
        res.json(facultyMembers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed initial faculty if empty
router.post('/seed', async (req, res) => {
    try {
        const count = await Faculty.countDocuments();
        if (count === 0) {
            await Faculty.insertMany([
                { name: 'Dr. Alan Turing', department: 'C.S.E', status: 'Active' },
                { name: 'Grace Hopper', department: 'I.T.', status: 'Pending' }
            ]);
            res.json({ message: 'Faculty seeded' });
        } else {
            res.json({ message: 'Faculty already seeded' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update faculty status
router.put('/:id/status', async (req, res) => {
    try {
        const updatedFaculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedFaculty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
