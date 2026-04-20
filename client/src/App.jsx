import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './redux/slices/authSlice'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import GoogleCallback from './pages/Auth/GoogleCallback'
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
    return (
      <div className="auth-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 mb-4 shadow-lg shadow-red-500/20 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            </svg>
          </div>
          <p className="text-white/50 font-medium text-lg logo-shimmer">Loading Lescht...</p>
        </div>
      </div>
    );
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

      {/* Google OAuth callback */}
      <Route 
        path="/auth/google/callback" 
        element={<GoogleCallback />} 
      />
    </Routes>
  );
}

export default App;
