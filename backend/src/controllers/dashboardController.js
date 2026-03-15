const User = require('../models/User');
const Subject = require('../models/Subject');
const Question = require('../models/Question');

exports.getStats = async (req, res, next) => {
    try {
        const stats = {
            counts: {
                users: await User.countDocuments(),
                subjects: await Subject.countDocuments(),
                questions: await Question.countDocuments()
            },
            questionsByDifficulty: await Question.aggregate([
                { $group: { _id: '$difficulty', count: { $sum: 1 } } }
            ]),
            questionsBySubject: await Question.aggregate([
                {
                    $group: {
                        _id: '$subject',
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'subjectDetails'
                    }
                },
                { $unwind: '$subjectDetails' },
                {
                    $project: {
                        _id: 0,
                        subjectName: '$subjectDetails.name',
                        count: 1
                    }
                }
            ])
        };

        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (err) {
        next(err);
    }
};
