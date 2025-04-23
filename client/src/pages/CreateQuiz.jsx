import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizApi } from '../services/api'

function CreateQuiz() {
  const navigate = useNavigate()
  const playerName = localStorage.getItem('playerName')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }
    ]
  })

  if (!playerName) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!quiz.title.trim() || !quiz.description.trim()) {
      setError('Please fill in all quiz details')
      return
    }

    // Validate each question
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i]
      if (!q.question.trim()) {
        setError(`Question ${i + 1} is empty`)
        return
      }
      
      // Check if all options are filled
      if (q.options.some(opt => !opt.trim())) {
        setError(`All options for question ${i + 1} must be filled`)
        return
      }

      // Check if a correct answer is selected and matches an option
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
        setError(`Please select a correct answer for question ${i + 1}`)
        return
      }
    }

    try {
      setIsSubmitting(true)
      const newQuiz = {
        ...quiz,
        creator: playerName
      }
      await quizApi.create(newQuiz)
      navigate('/quizzes')
    } catch (error) {
      console.error('Error creating quiz:', error)
      setError('Failed to create quiz. Please try again.')
      setIsSubmitting(false)
    }
  }

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]
    }))
  }

  const updateQuestion = (index, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex) {
          const newOptions = [...q.options]
          newOptions[optionIndex] = value
          // If this was the correct answer, update it with the new value
          const correctAnswer = q.correctAnswer === q.options[optionIndex] ? value : q.correctAnswer
          return { ...q, options: newOptions, correctAnswer }
        }
        return q
      })
    }))
  }

  const setCorrectAnswer = (questionIndex, optionValue) => {
    updateQuestion(questionIndex, 'correctAnswer', optionValue)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Quiz Title
              </label>
              <input
                type="text"
                id="title"
                value={quiz.title}
                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                className="input mt-1"
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={quiz.description}
                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                className="input mt-1"
                rows="3"
                placeholder="Enter quiz description"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-outline"
              >
                Add Question
              </button>
            </div>

            {quiz.questions.map((question, qIndex) => (
              <div 
                key={qIndex}
                className="bg-gray-50 rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
                  {qIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuiz(prev => ({
                        ...prev,
                        questions: prev.questions.filter((_, i) => i !== qIndex)
                      }))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="input"
                    placeholder="Enter question"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="input flex-1"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={option === question.correctAnswer}
                            onChange={() => setCorrectAnswer(qIndex, option)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-600">Correct</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuiz
