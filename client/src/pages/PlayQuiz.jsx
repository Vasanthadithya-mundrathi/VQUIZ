import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { quizApi, userApi, gameApi } from '../services/api'

function PlayQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const playerName = localStorage.getItem('playerName')
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [feedback, setFeedback] = useState(null)
  const [streak, setStreak] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [answers, setAnswers] = useState([])

  // Redirect to welcome page if no player name
  if (!playerName) {
    navigate('/')
    return null
  }

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await quizApi.getById(id)
      return response.data
    }
  })

  useEffect(() => {
    if (!quizCompleted && !selectedAnswer && quiz) {
      setStartTime(Date.now())
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimeUp()
            return 30
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestion, quizCompleted, selectedAnswer, quiz])

  const handleTimeUp = useCallback(() => {
    if (!selectedAnswer) {
      setStreak(0)
      handleNextQuestion()
    }
  }, [selectedAnswer])

  const calculateQuestionScore = useCallback((isCorrect, timeSpent, currentStreak) => {
    let questionScore = 0
    if (isCorrect) {
      // Base score
      questionScore += 10

      // Time bonus (up to 10 points)
      const timeBonus = Math.max(0, Math.floor((30000 - timeSpent) / 3000))
      questionScore += timeBonus

      // Streak bonus (up to 5 points)
      const streakBonus = Math.min(currentStreak, 5)
      questionScore += streakBonus
    }
    return questionScore
  }, [])

  const handleAnswerSelect = useCallback((answer) => {
    if (selectedAnswer !== null || !quiz) return

    const endTime = Date.now()
    const timeSpent = endTime - startTime
    setSelectedAnswer(answer)

    const currentQuizQuestion = quiz.questions[currentQuestion]
    const isCorrect = answer === currentQuizQuestion.correctAnswer
    const newStreak = isCorrect ? streak + 1 : 0
    setStreak(newStreak)

    const questionScore = calculateQuestionScore(isCorrect, timeSpent, streak)
    if (isCorrect) {
      setScore(prevScore => prevScore + questionScore)
    }

    setAnswers(prev => [...prev, {
      question: currentQuestion,
      answer,
      isCorrect,
      timeSpent,
      score: questionScore
    }])

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect
        ? `+${questionScore} points! ${newStreak > 1 ? `${newStreak}x streak!` : ''}`
        : `Incorrect! The right answer was: ${currentQuizQuestion.correctAnswer}`
    })

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextQuestion()
    }, 2000)
  }, [quiz, currentQuestion, streak, startTime, calculateQuestionScore])

  const handleNextQuestion = useCallback(() => {
    if (!quiz) return

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
      setFeedback(null)
    } else {
      handleQuizComplete()
    }
  }, [currentQuestion, quiz])

  const handleQuizComplete = async () => {
    if (!quiz) return

    setQuizCompleted(true)
    try {
      // Create game record
      const gameResponse = await gameApi.create(id)
      const gameId = gameResponse.data._id

      // Update user stats
      await userApi.updateScore(playerName, id, score)

      // Submit final game score
      await gameApi.submitScore(gameId, playerName, score)
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  if (isLoading || !quiz) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="max-w-3xl mx-auto p-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
            <div className="text-5xl font-bold text-blue-600 mb-4">{score} points</div>
            <div className="text-gray-600 mb-6">
              Answered {answers.filter(a => a.isCorrect).length} out of {quiz.questions.length} correctly
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="font-medium mb-2">Question {index + 1}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {quiz.questions[answer.question].question}
                </div>
                <div className="text-sm">
                  Your answer: <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {answer.answer}
                  </span>
                </div>
                {!answer.isCorrect && (
                  <div className="text-sm text-gray-600 mt-1">
                    Correct answer: {quiz.questions[answer.question].correctAnswer}
                  </div>
                )}
                {answer.isCorrect && (
                  <div className="text-sm text-green-600 mt-1">
                    +{answer.score} points
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/quizzes')}
              className="btn btn-primary w-full"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="btn btn-outline w-full"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuizQuestion = quiz.questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold">
            Question {currentQuestion + 1}/{quiz.questions.length}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-blue-600 font-medium">Score: {score}</div>
            {streak > 1 && (
              <div className="text-green-600 font-medium animate-pulse">
                {streak}x Streak!
              </div>
            )}
            <div className={`font-medium ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-6">
            {currentQuizQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuizQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`quiz-option ${
                  selectedAnswer === option
                    ? selectedAnswer === currentQuizQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : selectedAnswer && option === currentQuizQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg mb-4 text-center font-medium ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {selectedAnswer && (
          <div className="text-center text-sm text-gray-500">
            Next question in 2 seconds...
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayQuiz
