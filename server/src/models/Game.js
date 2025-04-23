const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  answers: [{
    questionId: String,
    answer: String,
    isCorrect: Boolean,
    timeSpent: Number,
  }],
  completed: {
    type: Boolean,
    default: false,
  }
});

const GameSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'inProgress', 'completed'],
    default: 'waiting',
  },
  players: [PlayerSchema],
  maxPlayers: {
    type: Number,
    default: 5,
  },
  startedAt: Date,
  endedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Game', GameSchema);
