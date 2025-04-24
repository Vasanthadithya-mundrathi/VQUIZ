const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name } = req.body;
    let user = await User.findOne({ name });

    if (user) {
      return res.json({ user }); // Return existing user
    }

    user = new User({
      name,
      totalScore: 0,
      gamesPlayed: 0,
      quizzesTaken: []
    });

    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user stats
router.get('/:name/stats', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name })
      .populate('quizzesTaken.quiz')
      .populate('quizzesCreated');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user score
router.post('/:name/score', async (req, res) => {
  try {
    const { quizId, score } = req.body;
    const user = await User.findOne({ name: req.params.name });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update quiz-specific stats
    const existingQuizStat = user.quizStats.find(
      stat => stat.quiz.toString() === quizId
    );

    if (existingQuizStat) {
      existingQuizStat.totalScore += score;
      existingQuizStat.attempts += 1;
      existingQuizStat.lastPlayed = new Date();
      if (score > existingQuizStat.highestScore) {
        existingQuizStat.highestScore = score;
      }
    } else {
      user.quizStats.push({
        quiz: quizId,
        highestScore: score,
        totalScore: score,
        attempts: 1,
        lastPlayed: new Date()
      });
    }

    // Update overall stats
    user.totalScore += score;
    user.gamesPlayed += 1;

    // Add to quizzesTaken array
    user.quizzesTaken.push({
      quiz: quizId,
      score: score,
      completedAt: new Date()
    });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's quiz history
router.get('/:name/history', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name })
      .populate('quizzesTaken.quiz', 'title description');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const history = user.quizzesTaken.map(attempt => ({
      quiz: attempt.quiz,
      score: attempt.score,
      completedAt: attempt.completedAt
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz-specific stats for a user
router.get('/:name/stats/:quizId', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = user.getQuizStats(req.params.quizId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
