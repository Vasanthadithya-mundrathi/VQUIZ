const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users without affecting actual registered users
    const result = await User.deleteMany({
      createdAt: { $lt: new Date() },  // Only delete old seeded users
      name: { $in: ['QuizMaster', 'BrainBox', 'TriviaKing', 'QuizWhiz', 'MindMaster'] }
    });
    console.log('Cleared sample users');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

module.exports = seedUsers;
