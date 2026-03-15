const Subject = require('../models/Subject');
const AppError = require('../utils/AppError');

exports.getAllSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find().populate('createdBy', 'name');

        res.status(200).json({
            status: 'success',
            results: subjects.length,
            data: {
                subjects
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return next(new AppError('No subject found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                subject
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createSubject = async (req, res, next) => {
    try {
        // Add user ID to the body
        req.body.createdBy = req.user.id;

        const newSubject = await Subject.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                subject: newSubject
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!subject) {
            return next(new AppError('No subject found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                subject
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {
            return next(new AppError('No subject found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
