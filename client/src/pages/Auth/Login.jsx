import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4">
      <div className="card w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Welcome to Lescht</h2>
        {error && <div className="bg-primary-light text-primary p-3 rounded-md mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary mt-2"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-text-secondary">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
