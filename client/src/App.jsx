import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import BrowseQuizzes from './pages/BrowseQuizzes'
import PlayQuiz from './pages/PlayQuiz'
import CreateQuiz from './pages/CreateQuiz'
import Leaderboard from './pages/Leaderboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="quizzes" element={<BrowseQuizzes />} />
            <Route path="quizzes/:id" element={<PlayQuiz />} />
            <Route path="create" element={<CreateQuiz />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
