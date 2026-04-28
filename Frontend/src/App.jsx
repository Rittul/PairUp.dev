import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './components/Profile'
import Updateprofile from './components/Updateprofile'
import Chat from './components/Chat'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/updateprofile"
        element={
          <ProtectedRoute>
            <Updateprofile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
