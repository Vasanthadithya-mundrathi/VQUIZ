require('dotenv').config();
const seedUsers = require('./seed/users.seed');
const Quiz = require('./models/Quiz');
const mongoose = require('mongoose');

const programmingQuiz = {
  title: "Programming Fundamentals",
  description: "Test your knowledge of programming concepts",
  creator: "System",
  questions: [
    {
      question: "What is the output of: typeof []?",
      options: ["array", "object", "undefined", "null"],
      correctAnswer: "object"
    },
    {
      question: "Which method adds elements to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: "push()"
    },
    {
      question: "What is closure in JavaScript?",
      options: [
        "A way to lock variables",
        "A function that has access to variables in its outer scope",
        "A method to close browser windows",
        "A way to end loops"
      ],
      correctAnswer: "A function that has access to variables in its outer scope"
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Computer Style System",
        "Creative Style Setup",
        "Coded Style Structures"
      ],
      correctAnswer: "Cascading Style Sheets"
    },
    {
      question: "What is the purpose of 'use strict' in JavaScript?",
      options: [
        "To enable strict type checking",
        "To enforce stricter parsing and error handling",
        "To improve performance",
        "To enable new JavaScript features"
      ],
      correctAnswer: "To enforce stricter parsing and error handling"
    }
  ]
};

const scienceQuiz = {
  title: "Advanced Science",
  description: "Challenge yourself with advanced science questions",
  creator: "System",
  questions: [
    {
      question: "What is the largest organelle in a cell?",
      options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Vacuole"],
      correctAnswer: "Nucleus"
    },
    {
      question: "Which particle has no electric charge?",
      options: ["Proton", "Electron", "Neutron", "Positron"],
      correctAnswer: "Neutron"
    },
    {
      question: "What is the speed of light in meters per second?",
      options: ["299,792,458", "300,000,000", "299,999,999", "298,792,458"],
      correctAnswer: "299,792,458"
    },
    {
      question: "Which planet has the most moons?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      correctAnswer: "Saturn"
    },
    {
      question: "What is the chemical formula for table salt?",
      options: ["NaCl", "H2O", "CO2", "CaCO3"],
      correctAnswer: "NaCl"
    }
  ]
};

const historyQuiz = {
  title: "World History",
  description: "Explore major historical events and figures",
  creator: "System",
  questions: [
    {
      question: "Who was the first female Prime Minister of India?",
      options: ["Indira Gandhi", "Sonia Gandhi", "Pratibha Patil", "Sarojini Naidu"],
      correctAnswer: "Indira Gandhi"
    },
    {
      question: "In which year did World War II end?",
      options: ["1945", "1944", "1946", "1943"],
      correctAnswer: "1945"
    },
    {
      question: "Which empire was the largest in history?",
      options: [
        "British Empire",
        "Mongol Empire",
        "Roman Empire",
        "Persian Empire"
      ],
      correctAnswer: "British Empire"
    },
    {
      question: "Who wrote 'The Art of War'?",
      options: ["Sun Tzu", "Confucius", "Lao Tzu", "Buddha"],
      correctAnswer: "Sun Tzu"
    },
    {
      question: "Which ancient wonder still exists today?",
      options: [
        "Great Pyramid of Giza",
        "Hanging Gardens of Babylon",
        "Colossus of Rhodes",
        "Lighthouse of Alexandria"
      ],
      correctAnswer: "Great Pyramid of Giza"
    }
  ]
};

const movieQuiz = {
  title: "Movie Trivia",
  description: "Test your knowledge of famous movies",
  creator: "System",
  questions: [
    {
      question: "Which movie won the Best Picture Oscar in 2024?",
      options: [
        "Oppenheimer",
        "Barbie",
        "Killers of the Flower Moon",
        "Poor Things"
      ],
      correctAnswer: "Oppenheimer"
    },
    {
      question: "Who played Tony Stark/Iron Man in the MCU?",
      options: [
        "Robert Downey Jr.",
        "Chris Evans",
        "Chris Hemsworth",
        "Mark Ruffalo"
      ],
      correctAnswer: "Robert Downey Jr."
    },
    {
      question: "Which movie features the character Jack Dawson?",
      options: ["Titanic", "The Departed", "Inception", "The Revenant"],
      correctAnswer: "Titanic"
    },
    {
      question: "Who directed 'Pulp Fiction'?",
      options: [
        "Quentin Tarantino",
        "Martin Scorsese",
        "Steven Spielberg",
        "Christopher Nolan"
      ],
      correctAnswer: "Quentin Tarantino"
    },
    {
      question: "Which is the highest-grossing film of all time?",
      options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: Episode VII"],
      correctAnswer: "Avatar"
    }
  ]
};

const sportsQuiz = {
  title: "Sports Champions",
  description: "Challenge your sports knowledge",
  creator: "System",
  questions: [
    {
      question: "Which country has won the most FIFA World Cups?",
      options: ["Brazil", "Germany", "Italy", "Argentina"],
      correctAnswer: "Brazil"
    },
    {
      question: "Who holds the record for most Olympic medals?",
      options: [
        "Michael Phelps",
        "Usain Bolt",
        "Simone Biles",
        "Larisa Latynina"
      ],
      correctAnswer: "Michael Phelps"
    },
    {
      question: "Which team has won the most NBA championships?",
      options: [
        "Boston Celtics",
        "Los Angeles Lakers",
        "Chicago Bulls",
        "Golden State Warriors"
      ],
      correctAnswer: "Boston Celtics"
    },
    {
      question: "In which sport would you perform a 'slam dunk'?",
      options: ["Basketball", "Volleyball", "Tennis", "Baseball"],
      correctAnswer: "Basketball"
    },
    {
      question: "Who is often called 'The Greatest' in boxing?",
      options: [
        "Muhammad Ali",
        "Mike Tyson",
        "Floyd Mayweather",
        "Manny Pacquiao"
      ],
      correctAnswer: "Muhammad Ali"
    }
  ]
};

const topics = [
  "Music", "Geography", "Food & Cuisine", "Technology",
  "Art", "Literature", "Space", "Animals",
  "Mathematics", "Famous Personalities", "Inventions", "Natural Wonders",
  "Ancient Civilizations", "Modern Culture", "Science Fiction"
];

const generateQuestions = (topic) => {
  return [
    {
      question: `What is the most significant ${topic.toLowerCase()} development of the 21st century?`,
      options: ["Innovation A", "Discovery B", "Breakthrough C", "Achievement D"],
      correctAnswer: "Innovation A"
    },
    {
      question: `Who is considered the pioneer in ${topic.toLowerCase()}?`,
      options: ["Person W", "Person X", "Person Y", "Person Z"],
      correctAnswer: "Person X"
    },
    {
      question: `Which ${topic.toLowerCase()} fact is most surprising?`,
      options: ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
      correctAnswer: "Fact 2"
    },
    {
      question: `What is the future of ${topic.toLowerCase()}?`,
      options: ["Prediction A", "Prediction B", "Prediction C", "Prediction D"],
      correctAnswer: "Prediction C"
    },
    {
      question: `How has ${topic.toLowerCase()} changed over time?`,
      options: ["Evolution 1", "Evolution 2", "Evolution 3", "Evolution 4"],
      correctAnswer: "Evolution 2"
    }
  ];
};

const generatedQuizzes = topics.map(topic => ({
  title: `${topic} Master Quiz`,
  description: `Test your knowledge of ${topic.toLowerCase()}`,
  creator: "System",
  questions: generateQuestions(topic)
}));

const allQuizzes = [
  programmingQuiz,
  scienceQuiz,
  historyQuiz,
  movieQuiz,
  sportsQuiz,
  ...generatedQuizzes
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    await Quiz.insertMany(allQuizzes);
    console.log(`Inserted ${allQuizzes.length} quizzes successfully`);

    // Seed users
    await seedUsers();
    
    await mongoose.connection.close();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
