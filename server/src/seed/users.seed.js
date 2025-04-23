const mongoose = require('mongoose');
const User = require('../models/User');

const sampleUsers = [
  {
    name: 'QuizMaster',
    totalScore: 550,
    gamesPlayed: 10,
    quizzesTaken: []
  },
  {
    name: 'BrainBox',
    totalScore: 480,
    gamesPlayed: 8,
    quizzesTaken: []
  },
  {
    name: 'TriviaKing',
    totalScore: 420,
    gamesPlayed: 7,
    quizzesTaken: []
  },
  {
    name: 'QuizWhiz',
    totalScore: 390,
    gamesPlayed: 6,
    quizzesTaken: []
  },
  {
    name: 'MindMaster',
    totalScore: 350,
    gamesPlayed: 5,
    quizzesTaken: []
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    await User.insertMany(sampleUsers);
    console.log(`Inserted ${sampleUsers.length} sample users`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

module.exports = seedUsers;
