import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      triggerShake();
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div className="auth-page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className={`auth-card ${shake ? 'shake' : ''}`}>
        <div className="text-center">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please enter your details to sign in</p>
        </div>

        {error && (
          <div
            className="alert alert-danger"
            style={{
              borderRadius: '12px',
              fontSize: '0.9rem',
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.2)',
              color: '#ea868f',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group-custom mb-3">
            <label className="input-label-custom">Email Address</label>
            <div className="input-icon-wrapper">
              <input
                type="email"
                className="form-control-custom"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bi bi-envelope field-icon"></i>
            </div>
          </div>

          <div className="form-group-custom mb-3">
            <label className="input-label-custom">Password</label>
            <div className="input-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control-custom"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="bi bi-lock field-icon"></i>
              <i
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} password-toggle`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="auth-options mb-4">
            <label className="checkbox-custom">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="auth-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn-gradient w-100 py-3">Sign In</button>
        </form>

        <div className="auth-footer mt-4 text-center">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
