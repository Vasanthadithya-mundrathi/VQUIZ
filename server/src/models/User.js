const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalScore: {
    type: Number,
    default: 0,
    min: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  quizzesCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  quizzesTaken: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    highestScore: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  // Track quiz-specific stats
  quizStats: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    highestScore: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastPlayed: {
      type: Date
    }
  }]
});

// Pre-save middleware to ensure quiz stats are properly maintained
UserSchema.pre('save', function(next) {
  // Update quiz stats when a new quiz is taken
  if (this.isModified('quizzesTaken')) {
    const lastQuiz = this.quizzesTaken[this.quizzesTaken.length - 1];
    
    if (lastQuiz) {
      const quizStat = this.quizStats.find(
        stat => stat.quiz.toString() === lastQuiz.quiz.toString()
      );

      if (quizStat) {
        // Update existing quiz stat
        quizStat.totalScore += lastQuiz.score;
        quizStat.attempts += 1;
        quizStat.lastPlayed = lastQuiz.completedAt;
        if (lastQuiz.score > quizStat.highestScore) {
          quizStat.highestScore = lastQuiz.score;
        }
      } else {
        // Create new quiz stat
        this.quizStats.push({
          quiz: lastQuiz.quiz,
          highestScore: lastQuiz.score,
          totalScore: lastQuiz.score,
          attempts: 1,
          lastPlayed: lastQuiz.completedAt
        });
      }
    }
  }
  next();
});

// Method to get user's stats for a specific quiz
UserSchema.methods.getQuizStats = function(quizId) {
  const stats = this.quizStats.find(
    stat => stat.quiz.toString() === quizId.toString()
  );
  
  if (!stats) {
    return {
      highestScore: 0,
      totalScore: 0,
      attempts: 0,
      averageScore: 0
    };
  }

  return {
    highestScore: stats.highestScore,
    totalScore: stats.totalScore,
    attempts: stats.attempts,
    averageScore: Math.round(stats.totalScore / stats.attempts),
    lastPlayed: stats.lastPlayed
  };
};

module.exports = mongoose.model('User', UserSchema);
