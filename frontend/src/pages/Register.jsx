import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      triggerShake();
      return;
    }

    if (!agree) {
      setError('You must agree to the Terms & Conditions');
      triggerShake();
      return;
    }

    const res = await register(name, email, password);
    if (res.success) {
      alert('Account created successfully! Please log in.');
      navigate('/login');
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
    <div className="auth-page-wrapper" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className={`auth-card my-4 ${shake ? 'shake' : ''}`}>
        <div className="text-center">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to access all premium features</p>
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
            <label className="input-label-custom">Full Name</label>
            <div className="input-icon-wrapper">
              <input
                type="text"
                className="form-control-custom"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <i className="bi bi-person field-icon"></i>
            </div>
          </div>

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
                minLength="6"
              />
              <i className="bi bi-lock field-icon"></i>
              <i
                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} password-toggle`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-group-custom mb-3">
            <label className="input-label-custom">Confirm Password</label>
            <div className="input-icon-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control-custom"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
              <i className="bi bi-lock-fill field-icon"></i>
              <i
                className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} password-toggle`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="auth-options my-3 mb-4">
            <label className="checkbox-custom">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>I agree to the <a href="#" className="auth-link">Terms & Conditions</a></span>
            </label>
          </div>

          <button type="submit" className="btn-gradient w-100 py-3">Register</button>
        </form>

        <div className="auth-footer mt-4 text-center">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
