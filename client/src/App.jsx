import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './redux/slices/authSlice'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ChatLayout from './components/chat/ChatLayout'

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    // Attempt session recovery on boot
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getMe());
    } else {
      // Force loading false if no token
      dispatch({ type: 'auth/getMe/rejected' });
    }
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-accent">Loading Lescht...</div>
  }

  return (
    <Routes>
      {/* Protected Route */}
      <Route 
        path="/" 
        element={isAuthenticated ? <ChatLayout /> : <Navigate to="/login" replace />} 
      />
      
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
      />
    </Routes>
  );
}

export default App;
