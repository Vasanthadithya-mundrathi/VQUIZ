import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { quizApi } from '../services/api'
import { useState } from 'react'

function BrowseQuizzes() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const playerName = localStorage.getItem('playerName')

  // Redirect to welcome page if no player name
  if (!playerName) {
    navigate('/')
    return null
  }

  const { data: quizzes, isLoading, error, refetch } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await quizApi.getAll()
      return response.data
    },
    refetchOnMount: true // Always refetch when component mounts
  })

  const handleStartQuiz = (quizId) => {
    navigate(`/quizzes/${quizId}`)
  }

  const filteredQuizzes = quizzes?.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.creator.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl">
        <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Quizzes</h3>
        <p className="text-red-600 mb-4">Please try again later.</p>
        <button 
          onClick={() => refetch()} 
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-md">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Quizzes</h1>
          <p className="text-gray-600">
            {filteredQuizzes?.length} {filteredQuizzes?.length === 1 ? 'quiz' : 'quizzes'} available
          </p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full md:w-80 pl-10"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
      </div>

      {filteredQuizzes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="card group hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {quiz.questions.length} Questions
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {quiz.description}
                </p>
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z"/>
                  </svg>
                  <span>{quiz.creator}</span>
                </div>
                
                <button
                  onClick={() => handleStartQuiz(quiz._id)}
                  className="btn btn-primary w-full group-hover:shadow-lg"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white rounded-xl shadow-md p-8">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'No quizzes are available at the moment'}
          </p>
          <button
            onClick={() => navigate('/create')}
            className="btn btn-primary"
          >
            Create a Quiz
          </button>
        </div>
      )}
    </div>
  )
}

export default BrowseQuizzes
