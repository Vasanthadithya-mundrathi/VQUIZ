const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Get leaderboard by quiz ID
router.get('/leaderboard/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    
    // First verify the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quizObjectId = new mongoose.Types.ObjectId(quizId);

    const leaderboard = await User.aggregate([
      // Match users who have played this quiz
      {
        $match: {
          'quizStats.quiz': quizObjectId
        }
      },
      // Unwind quizStats array
      {
        $unwind: '$quizStats'
      },
      // Match the specific quiz
      {
        $match: {
          'quizStats.quiz': quizObjectId
        }
      },
      // Project required fields
      {
        $project: {
          playerName: '$name',
          highestScore: '$quizStats.highestScore',
          totalScore: '$quizStats.totalScore',
          gamesPlayed: '$quizStats.attempts',
          averageScore: {
            $round: [
              { $divide: ['$quizStats.totalScore', '$quizStats.attempts'] },
              0
            ]
          }
        }
      },
      // Sort by highest score
      {
        $sort: {
          highestScore: -1
        }
      },
      // Limit to top 100
      {
        $limit: 100
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get global leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      // Match users who have played at least one game
      {
        $match: {
          gamesPlayed: { $gt: 0 }
        }
      },
      // Project required fields
      {
        $project: {
          playerName: '$name',
          totalScore: 1,
          gamesPlayed: 1,
          averageScore: {
            $round: [
              { $divide: ['$totalScore', '$gamesPlayed'] },
              0
            ]
          }
        }
      },
      // Sort by total score
      {
        $sort: {
          totalScore: -1
        }
      },
      // Limit to top 100
      {
        $limit: 100
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Global leaderboard error:', error);
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
    console.error('Create game error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Submit final score
router.post('/:id/submit', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const { playerName, score } = req.body;

    // Find user or create a new one
    let user = await User.findOne({ name: playerName });
    if (!user) {
      user = new User({
        name: playerName,
        totalScore: score,
        gamesPlayed: 1,
        quizStats: [{
          quiz: game.quizId,
          highestScore: score,
          totalScore: score,
          attempts: 1,
          lastPlayed: new Date()
        }]
      });
    } else {
      // Update user stats
      user.totalScore += score;
      user.gamesPlayed += 1;
      
      // Update quiz-specific stats
      const quizStat = user.quizStats.find(
        stat => stat.quiz.toString() === game.quizId.toString()
      );

      if (quizStat) {
        quizStat.totalScore += score;
        quizStat.attempts += 1;
        quizStat.lastPlayed = new Date();
        if (score > quizStat.highestScore) {
          quizStat.highestScore = score;
        }
      } else {
        user.quizStats.push({
          quiz: game.quizId,
          highestScore: score,
          totalScore: score,
          attempts: 1,
          lastPlayed: new Date()
        });
      }
    }

    // Save user first
    await user.save();

    // Update game
    game.players.push({
      name: playerName,
      score: score,
      completed: true,
      completedAt: new Date()
    });

    game.status = 'completed';
    game.endedAt = new Date();
    await game.save();

    res.json({ game, user });
  } catch (error) {
    console.error('Submit score error:', error);
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
    console.error('Get game error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
