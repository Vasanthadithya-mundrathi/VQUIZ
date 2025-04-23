const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Get leaderboard
router.get('/leaderboard/:timeFilter', async (req, res) => {
  try {
    const timeFilter = req.params.timeFilter || 'all';
    let dateFilter = {};

    const now = new Date();
    switch (timeFilter) {
      case 'today':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setHours(0, 0, 0, 0))
          }
        };
        break;
      case 'week':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setDate(now.getDate() - 7))
          }
        };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setMonth(now.getMonth() - 1))
          }
        };
        break;
    }

    const users = await User.find()
      .sort({ totalScore: -1 })
      .limit(100)
      .select('name totalScore gamesPlayed -_id');

    const leaderboard = users.map(user => ({
      playerName: user.name,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      averageScore: user.gamesPlayed > 0 ? Math.round(user.totalScore / user.gamesPlayed) : 0
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new game
router.post('/', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.body.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const game = new Game({
      quizId: quiz._id,
      status: 'active',
      startedAt: new Date(),
      players: []
    });

    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit final score
router.post('/:id/submit', async (req, res) => {
  try {
    // Update game
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const { playerName, score } = req.body;

    game.players.push({
      name: playerName,
      score: score,
      completed: true
    });

    game.status = 'completed';
    game.endedAt = new Date();
    await game.save();

    // Update user stats
    let user = await User.findOne({ name: playerName });
    
    if (!user) {
      user = new User({
        name: playerName,
        totalScore: score,
        gamesPlayed: 1,
        quizzesTaken: [{
          quiz: game.quizId,
          score: score,
          completedAt: new Date()
        }]
      });
    } else {
      user.totalScore += score;
      user.gamesPlayed += 1;
      user.quizzesTaken.push({
        quiz: game.quizId,
        score: score,
        completedAt: new Date()
      });
    }

    await user.save();
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('quizId');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
