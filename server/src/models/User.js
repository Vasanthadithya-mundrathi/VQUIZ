const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  quizzesCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  quizzesTaken: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    completedAt: Date
  }]
});

module.exports = mongoose.model('User', UserSchema);
