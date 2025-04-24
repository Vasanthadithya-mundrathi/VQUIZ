import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi, quizApi, gameApi } from '../services/api'

function Leaderboard() {
  const navigate = useNavigate()
  const playerName = localStorage.getItem('playerName')
  const [selectedQuiz, setSelectedQuiz] = useState('global')

  // Redirect to welcome page if no player name
  if (!playerName) {
    navigate('/')
    return null
  }

  // Fetch available quizzes
  const { data: quizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await quizApi.getAll()
      return response.data
    }
  })

  // Fetch leaderboard data based on selection
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedQuiz],
    queryFn: async () => {
      if (selectedQuiz === 'global') {
        const response = await gameApi.getLeaderboard()
        return response.data
      } else {
        const response = await gameApi.getLeaderboard(selectedQuiz)
        return response.data
      }
    }
  })

  const getPositionStyle = (position) => {
    switch (position) {
      case 0:
        return 'bg-yellow-50 border-yellow-200 shadow-yellow-100'
      case 1:
        return 'bg-gray-50 border-gray-200 shadow-gray-100'
      case 2:
        return 'bg-orange-50 border-orange-200 shadow-orange-100'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const getMedalEmoji = (position) => {
    switch (position) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8 text-center border-b bg-gradient-to-r from-blue-500 to-blue-600">
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-blue-100">
            {selectedQuiz === 'global' 
              ? 'Overall rankings across all quizzes'
              : `Rankings for ${quizzes?.find(q => q._id === selectedQuiz)?.title || 'selected quiz'}`}
          </p>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="input w-full max-w-md mx-auto block"
          >
            <option value="global">Global Leaderboard</option>
            {quizzes?.map(quiz => (
              <option key={quiz._id} value={quiz._id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {leaderboard?.map((entry, index) => (
              <div
                key={entry.playerName}
                className={`flex items-center p-4 rounded-lg border transition-all duration-200 ${
                  getPositionStyle(index)
                } ${
                  entry.playerName === playerName 
                    ? 'ring-2 ring-blue-500 transform scale-[1.02]'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex-shrink-0 w-12 text-2xl font-bold text-center">
                  {getMedalEmoji(index) || index + 1}
                </div>
                <div className="flex-1 px-4">
                  <div className="font-semibold text-lg flex items-center gap-2">
                    {entry.playerName}
                    {entry.playerName === playerName && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full animate-pulse">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Games played: {entry.gamesPlayed}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedQuiz === 'global' ? entry.totalScore : entry.highestScore}
                  </div>
                  <div className="text-sm text-gray-500">
                    avg: {Math.round(entry.averageScore)}
                  </div>
                </div>
              </div>
            ))}

            {(!leaderboard || leaderboard.length === 0) && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No scores recorded yet
                </div>
                <button
                  onClick={() => navigate('/quizzes')}
                  className="btn btn-primary"
                >
                  Be the First to Play!
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-blue-50">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Scoring System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium text-blue-800 mb-2">Base Points</div>
              <p className="text-gray-600">10 points per correct answer</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium text-blue-800 mb-2">Speed Bonus</div>
              <p className="text-gray-600">Up to 10 extra points for fast answers</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium text-blue-800 mb-2">Streak Bonus</div>
              <p className="text-gray-600">Up to 5 points for answer streaks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
