import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const playerName = localStorage.getItem('playerName')

  // If no player name and not on welcome page, redirect to welcome
  if (!playerName && location.pathname !== '/') {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {playerName && location.pathname !== '/' && (
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/quizzes"
                  className="flex items-center px-2 py-2 text-lg font-bold text-blue-600"
                >
                  V-Quiz
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/quizzes"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/quizzes'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Browse
                </Link>
                <Link
                  to="/create"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/create'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Create Quiz
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/leaderboard'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Leaderboard
                </Link>
                <div className="flex items-center pl-4 border-l">
                  <span className="text-sm font-medium text-gray-700">
                    {playerName}
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('playerName')
                      navigate('/')
                    }}
                    className="ml-3 text-sm text-red-600 hover:text-red-800"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-white mt-8 py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 V-Quiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
