import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../services/api'

function Leaderboard() {
  const navigate = useNavigate()
  const playerName = localStorage.getItem('playerName')
  const [timeFilter, setTimeFilter] = useState('all')

  // Redirect to welcome page if no player name
  if (!playerName) {
    navigate('/')
    return null
  }

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', timeFilter],
    queryFn: async () => {
      const response = await userApi.getLeaderboard(timeFilter)
      return response.data
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

  const filterButtons = [
    { label: 'All Time', value: 'all' },
    { label: 'This Month', value: 'month' },
    { label: 'This Week', value: 'week' },
    { label: 'Today', value: 'today' }
  ]

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
            Top quiz masters showcasing their knowledge
          </p>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-wrap justify-center gap-2">
            {filterButtons.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeFilter(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  timeFilter === value
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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
                    {entry.totalScore}
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
            How Scores are Calculated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium text-blue-800 mb-2">Base Points</div>
              <p className="text-gray-600">10 points for each correct answer</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium text-blue-800 mb-2">Speed Bonus</div>
              <p className="text-gray-600">Up to 10 extra points for quick answers</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium text-blue-800 mb-2">Streak Bonus</div>
              <p className="text-gray-600">Extra points for consecutive correct answers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
