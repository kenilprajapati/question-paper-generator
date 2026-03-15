const generatorService = require('../services/generatorService');
const AppError = require('../utils/AppError');

exports.generate = async (req, res, next) => {
    try {
        const { subjectId, totalMarks, units } = req.body;

        if (!subjectId || !totalMarks) {
            return next(new AppError('Subject and Total Marks are required', 400));
        }

        const result = await generatorService.generatePaper({
            subjectId,
            totalMarks,
            units
        });

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        next(err);
    }
};
