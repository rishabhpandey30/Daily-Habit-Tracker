import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../api';

const AuthForm = ({ type }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      let data;
      if (type === 'register') {
        data = await register(username, password);
      } else {
        data = await login(username, password);
      }

      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
        setMessage(`Successfully ${type === 'register' ? 'registered' : 'logged in'}! Redirecting...`);
        setMessageType('success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage(data.message || 'Something went wrong.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error or server issue.');
      setMessageType('error');
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="card auth-form-card">
      <h2>{type === 'register' ? 'Register' : 'Login'}</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          {type === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="auth-switch">
        {type === 'register' ? (
          <>
            Already have an account? <a href="/login">Login here</a>
          </>
        ) : (
          <>
            Don't have an account? <a href="/register">Register here</a>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;