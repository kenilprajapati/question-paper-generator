const express = require('express');
const questionController = require('../controllers/questionController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.get('/stats', questionController.getQuestionStats);

router
    .route('/')
    .get(questionController.getAllQuestions)
    .post(questionController.createQuestion);

router
    .route('/:id')
    .get(questionController.getQuestion)
    .patch(questionController.updateQuestion)
    .delete(questionController.deleteQuestion);

module.exports = router;
