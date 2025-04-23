const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    // Validate quiz data
    const { title, description, questions, creator } = req.body;

    if (!title || !description || !questions || !creator) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Quiz must have at least one question' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.question || !question.options || !question.correctAnswer) {
        return res.status(400).json({ 
          message: 'Each question must have a question text, options, and correct answer' 
        });
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        return res.status(400).json({ 
          message: 'Each question must have at least 2 options' 
        });
      }

      if (!question.options.includes(question.correctAnswer)) {
        return res.status(400).json({ 
          message: 'Correct answer must be one of the options' 
        });
      }
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      creator,
      createdAt: new Date()
    });

    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get quizzes by creator
router.get('/creator/:name', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.params.name }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quiz
router.patch('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Only allow creator to update
    if (quiz.creator !== req.body.creator) {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    Object.assign(quiz, req.body);
    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Only allow creator to delete
    if (quiz.creator !== req.body.creator) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.remove();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
