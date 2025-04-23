# V-Quiz - Interactive Multiplayer Quiz Application

A real-time multiplayer quiz application where users can participate in quizzes, create their own quizzes, and compete with others.

## Features

- Real-time multiplayer quizzes with up to 5 players
- Create and share custom quizzes
- Built-in collection of 20 diverse quizzes
- Live leaderboard with various time filters
- Real-time score updates and player rankings
- Time-based scoring system
- User-friendly interface with responsive design

## Tech Stack

- **Frontend**:
  - React with Vite
  - TailwindCSS for styling
  - Socket.io client for real-time features
  - React Query for data fetching
  - React Router for navigation

- **Backend**:
  - Express.js server
  - MongoDB with Mongoose
  - Socket.io for real-time gameplay
  - RESTful API architecture

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd v-quiz
   ```

2. Install dependencies:
   ```bash
   npm run setup
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update MongoDB connection string if needed

4. Seed the database with initial quizzes:
   ```bash
   npm run seed
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

   This will start both the client (port 5173) and server (port 5000) concurrently.

## Usage

1. Open `http://localhost:5173` in your browser
2. Enter your name to begin
3. Browse available quizzes or create your own
4. Start a new game or join an existing one
5. Compete with other players in real-time
6. Check the leaderboard to see your ranking

## Game Rules

- Each correct answer is worth 10 points
- Quick answers earn bonus points (up to 10 extra points)
- All players must complete the quiz for results to be final
- Maximum of 5 players per game session
- Players can create unlimited custom quizzes

## Development

- Client code is in the `client` directory
- Server code is in the `server` directory
- Use `npm run dev` for development with hot reloading

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
