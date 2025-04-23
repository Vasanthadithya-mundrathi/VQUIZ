const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ name: req.body.name });
    
    if (existingUser) {
      // If user exists, return a 409 Conflict status code
      return res.status(409).json({ 
        message: 'This name is already taken. Please choose another one.'
      });
    }
    
    // Otherwise, create a new user
    const user = new User({
      name: req.body.name
    });
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user stats
router.get('/:name/stats', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name })
      .populate('quizzesTaken.quiz', 'title')
      .populate('quizzesCreated', 'title');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      quizzesTaken: user.quizzesTaken,
      quizzesCreated: user.quizzesCreated,
      averageScore: user.gamesPlayed > 0 ? user.totalScore / user.gamesPlayed : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user score
router.post('/:name/score', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { quizId, score } = req.body;

    // Add quiz to taken list
    user.quizzesTaken.push({
      quiz: quizId,
      score,
      completedAt: new Date()
    });

    // Update total score and games played
    user.totalScore += score;
    user.gamesPlayed += 1;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ totalScore: -1 })
      .limit(100)
      .select('name totalScore gamesPlayed -_id');

    res.json(leaderboard.map(user => ({
      playerName: user.name,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      averageScore: user.gamesPlayed > 0 ? user.totalScore / user.gamesPlayed : 0
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
