import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../services/api'

function Welcome() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if player name exists in local storage
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      navigate('/quizzes')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const trimmedName = playerName.trim()
    
    if (!trimmedName) {
      setError('Please enter your name')
      return
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long')
      return
    }

    if (trimmedName.length > 20) {
      setError('Name must be less than 20 characters')
      return
    }

    try {
      setIsLoading(true)
      await userApi.register(trimmedName)
      localStorage.setItem('playerName', trimmedName)
      navigate('/quizzes')
    } catch (error) {
      setError('This name is already taken. Please choose another one.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-3">
                Welcome to V-Quiz
              </h1>
              <p className="text-lg text-gray-600">
                Test your knowledge, challenge others
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your name to begin
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 animate-fade-in">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Start Quizzing
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Features:</h2>
            <ul className="space-y-4">
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Various quiz categories to test your knowledge
              </li>
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Earn points and compete on the leaderboard
              </li>
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create and share your own quizzes
              </li>
              <li className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Track your progress and achievements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
