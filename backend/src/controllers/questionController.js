const Question = require('../models/Question');
const AppError = require('../utils/AppError');

exports.getAllQuestions = async (req, res, next) => {
    try {
        // 1) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2) Advanced filtering (for gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Question.find(JSON.parse(queryStr)).populate('subject', 'name code');

        // 3) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 4) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 5) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        const questions = await query;

        res.status(200).json({
            status: 'success',
            results: questions.length,
            data: {
                questions
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id).populate('subject');

        if (!question) {
            return next(new AppError('No question found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createQuestion = async (req, res, next) => {
    try {
        const newQuestion = await Question.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                question: newQuestion
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!question) {
            return next(new AppError('No question found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return next(new AppError('No question found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

// Statistical analysis of questions per subject/unit
exports.getQuestionStats = async (req, res, next) => {
    try {
        const stats = await Question.aggregate([
            {
                $group: {
                    _id: '$subject',
                    numQuestions: { $sum: 1 },
                    avgMarks: { $avg: '$marks' },
                    minMarks: { $min: '$marks' },
                    maxMarks: { $max: '$marks' }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        next(err);
    }
};
