import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api'
})

export const userApi = {
  register: (name) => api.post('/users/register', { name }),
  getStats: (name) => api.get(`/users/${name}/stats`),
  updateScore: (name, quizId, score) => 
    api.post(`/users/${name}/score`, { quizId, score }),
  getLeaderboard: () => api.get('/users/leaderboard'),
}

export const quizApi = {
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (quizData) => api.post('/quizzes', quizData),
}

export const gameApi = {
  create: (quizId) => api.post('/games', { quizId }),
  getById: (id) => api.get(`/games/${id}`),
  submitScore: (gameId, playerName, score) => 
    api.post(`/games/${gameId}/submit`, { playerName, score }),
}

export default api
