import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import api from '../../utils/axios';

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);

  const googleError = searchParams.get('error');

  useEffect(() => {
    let isMounted = true;

    api.get('/auth/providers')
      .then((response) => {
        if (isMounted) {
          setGoogleEnabled(Boolean(response.data?.google?.enabled));
        }
      })
      .catch(() => {
        if (isMounted) {
          setGoogleEnabled(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    if (!googleEnabled) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const displayError =
    error ||
    (googleError === 'google_auth_failed'
      ? 'Google authentication failed. Please try again.'
      : googleError === 'google_auth_unavailable'
        ? 'Google sign-in is not configured for this local project yet. Use email/password for now.'
        : null);

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      {/* Decorative particles */}
      <div className="particle" style={{ width: 6, height: 6, background: '#e53935', top: '20%', left: '15%', animation: 'floatOrb1 12s ease-in-out infinite' }} />
      <div className="particle" style={{ width: 4, height: 4, background: '#7c4dff', top: '60%', right: '20%', animation: 'floatOrb2 18s ease-in-out infinite' }} />
      <div className="particle" style={{ width: 8, height: 8, background: '#ff7043', bottom: '25%', left: '30%', animation: 'floatOrb1 15s ease-in-out infinite reverse' }} />
      <div className="particle" style={{ width: 5, height: 5, background: '#42a5f5', top: '35%', right: '10%', animation: 'floatOrb2 20s ease-in-out infinite reverse' }} />

      <div className="glass-card w-full max-w-md p-8 md:p-10 relative z-10">
        {/* Logo & Heading */}
        <div className="auth-fade-in text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 mb-4 shadow-lg shadow-red-500/20">
            <MessageCircle size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold logo-shimmer tracking-tight">Lescht</h1>
          <p className="text-white/40 text-sm mt-2 font-medium">Welcome back — sign in to continue</p>
        </div>

        {/* Error display */}
        {displayError && (
          <div className="auth-error mb-5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Google Sign-In */}
        <div className="auth-fade-in delay-100">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="auth-btn auth-btn-google mb-5"
            id="google-login-btn"
            disabled={!googleEnabled}
            title={!googleEnabled ? 'Google sign-in is not configured yet' : 'Continue with Google'}
          >
            {GOOGLE_ICON}
            <span className="font-medium">
              {googleEnabled ? 'Continue with Google' : 'Google Sign-In Unavailable'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="auth-divider auth-fade-in delay-200 mb-5">
          <span>or</span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="auth-fade-in delay-200">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input pl-11"
                id="login-email"
              />
            </div>
          </div>

          <div className="auth-fade-in delay-300">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input pl-11 pr-20"
                id="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs font-medium transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="auth-fade-in delay-400 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="auth-btn auth-btn-primary group"
              id="login-submit-btn"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Register link */}
        <p className="auth-fade-in delay-500 text-center mt-8 text-sm text-white/40">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-red-400 font-semibold hover:text-red-300 transition-colors"
            id="goto-register"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
