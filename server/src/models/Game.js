const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  players: [{
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    answers: [{
      questionIndex: Number,
      answer: String,
      correct: Boolean,
      timeSpent: Number,
      score: Number
    }],
    joinedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  }]
}, {
  timestamps: true
});

// Pre-save middleware to calculate and update user stats
GameSchema.pre('save', async function(next) {
  try {
    if (this.isModified('players') && this.status === 'completed') {
      const User = mongoose.model('User');
      
      // Update each player's stats
      for (const player of this.players) {
        if (player.completed) {
          let user = await User.findOne({ name: player.name });
          
          if (!user) {
            user = new User({
              name: player.name,
              totalScore: 0,
              gamesPlayed: 0,
              quizzesTaken: []
            });
          }

          // Update quiz-specific stats
          const quizStat = user.quizStats.find(
            stat => stat.quiz.toString() === this.quizId.toString()
          );

          if (quizStat) {
            quizStat.totalScore += player.score;
            quizStat.attempts += 1;
            quizStat.lastPlayed = new Date();
            if (player.score > quizStat.highestScore) {
              quizStat.highestScore = player.score;
            }
          } else {
            user.quizStats.push({
              quiz: this.quizId,
              highestScore: player.score,
              totalScore: player.score,
              attempts: 1,
              lastPlayed: new Date()
            });
          }

          // Update overall stats
          user.totalScore += player.score;
          user.gamesPlayed += 1;
          user.quizzesTaken.push({
            quiz: this.quizId,
            score: player.score,
            completedAt: new Date()
          });

          await user.save();
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to get game stats
GameSchema.methods.getStats = function() {
  const stats = {
    totalPlayers: this.players.length,
    completedPlayers: this.players.filter(p => p.completed).length,
    averageScore: 0,
    highScore: 0,
    topPlayers: []
  };

  if (stats.completedPlayers > 0) {
    const completedPlayers = this.players.filter(p => p.completed);
    const totalScore = completedPlayers.reduce((sum, p) => sum + p.score, 0);
    stats.averageScore = Math.round(totalScore / stats.completedPlayers);
    stats.highScore = Math.max(...completedPlayers.map(p => p.score));
    stats.topPlayers = completedPlayers
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        score: p.score
      }));
  }

  return stats;
};

module.exports = mongoose.model('Game', GameSchema);
