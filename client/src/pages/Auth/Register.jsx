import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', displayName: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Create Account</h2>
        {error && <div className="bg-primary-light text-primary p-3 rounded-md mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Username</label>
            <input 
              type="text" 
              placeholder="johndoe" 
              required
              autoComplete="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Display Name (Optional)</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-bg-secondary border border-border p-3 rounded-md text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary mt-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-text-secondary">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
