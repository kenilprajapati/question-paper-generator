const Question = require('../models/Question');
const AppError = require('../utils/AppError');

/**
 * Service to handle question paper generation logic
 */
exports.generatePaper = async (config) => {
    const { 
        subjectId, 
        totalMarks, 
        units, // Array of unit numbers
        difficultyDistribution, // { Easy: 0.3, Medium: 0.5, Hard: 0.2 }
        typeDistribution // { MCQ: 0.4, Descriptive: 0.6 }
    } = config;

    // 1) Get all available questions for the subject and units
    const query = { subject: subjectId };
    if (units && units.length > 0) {
        query.unit = { $in: units };
    }

    const availableQuestions = await Question.find(query);

    if (availableQuestions.length === 0) {
        throw new AppError('No questions available for the selected subject and units', 400);
    }

    // 2) Implementation of a basic selection algorithm
    // In a professional system, this would be more complex (using knapsack or backtracking)
    // For now, we'll use a weighted random selection based on constraints
    
    let selectedQuestions = [];
    let currentTotalMarks = 0;

    // Shuffle available questions
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());

    // Simple greedy selection for demonstration
    // A robust industry algorithm would aim for exact totalMarks matching
    for (const q of shuffled) {
        if (currentTotalMarks + q.marks <= totalMarks) {
            selectedQuestions.push(q);
            currentTotalMarks += q.marks;
        }
        if (currentTotalMarks === totalMarks) break;
    }

    if (currentTotalMarks < totalMarks) {
        // Log warning or throw error depending on strictness
        console.warn(`Could only reach ${currentTotalMarks}/${totalMarks} marks with available questions.`);
    }

    return {
        selectedQuestions,
        totalMarks: currentTotalMarks,
        targetMarks: totalMarks,
        generatedAt: new Date()
    };
};
