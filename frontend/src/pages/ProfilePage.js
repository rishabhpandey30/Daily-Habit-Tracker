import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { getMe } from '../api';
import ProfileForm from '../components/ProfileForm';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getMe();
        if (data._id) {
          setUser(data);
        } else {
          setError(data.message || 'Failed to fetch user data.');
          if (data.message && data.message.includes('authorized')) {
            localStorage.removeItem('user');
            navigate('/login');
          }
        }
      } catch (err) {
        setError('Network error or server issue.');
        console.error('Fetch user data error:', err);
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="container profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container profile-page">
        <div className="message error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="header">
        <h1>User Profile</h1>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/calendar">Calendar</Link></li> {/* New Calendar Link */}
            <li><button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="btn btn-outline">Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className="container profile-content">
        <div className="card profile-info-card">
          <h2>Welcome, {user?.username}!</h2>
          <p>This is your profile page. Here you can manage your account settings.</p>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;