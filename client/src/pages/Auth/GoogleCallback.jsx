import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from '../../redux/slices/authSlice';
import { MessageCircle } from 'lucide-react';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user profile and redirect
      dispatch(getMe()).then((result) => {
        if (getMe.fulfilled.match(result)) {
          navigate('/', { replace: true });
        } else {
          navigate('/login?error=google_auth_failed', { replace: true });
        }
      });
    } else {
      navigate('/login?error=google_auth_failed', { replace: true });
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      <div className="glass-card p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 mb-6 shadow-lg shadow-red-500/20">
          <MessageCircle size={28} className="text-white" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-6 w-6 text-red-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-white/60 text-lg font-medium">Signing you in...</p>
        </div>
      </div>
    </div>
  );
}
