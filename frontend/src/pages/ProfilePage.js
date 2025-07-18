import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getHabits, getMe } from '../api'; // Import getHabits and getMe

// Helper function to check if two dates are the same day (ignoring time)
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper function to calculate the maximum streak for a single habit
const calculateMaxStreak = (completions) => {
  if (!completions || completions.length === 0) {
    return 0;
  }

  const sortedCompletions = completions
    .map(dateStr => {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
    .sort((a, b) => a - b);

  let maxStreak = 0;
  let currentStreak = 0;

  if (sortedCompletions.length > 0) {
    currentStreak = 1;
    maxStreak = 1;

    for (let i = 1; i < sortedCompletions.length; i++) {
      const prevDate = new Date(sortedCompletions[i - 1]);
      const currDate = new Date(sortedCompletions[i]);

      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }
  }
  return maxStreak;
};

// Helper function to calculate the current streak for a single habit
const calculateCurrentStreak = (completions) => {
  if (!completions || completions.length === 0) {
    return 0;
  }

  const sortedCompletions = completions
    .map(dateStr => {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
    .sort((a, b) => a - b);

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const lastCompletionTime = sortedCompletions[sortedCompletions.length - 1];
  const lastCompletionDate = new Date(lastCompletionTime);

  // Check if the last completion was today or yesterday
  if (isSameDay(lastCompletionDate, today)) {
    currentStreak = 1;
  } else if (isSameDay(lastCompletionDate, yesterday)) {
    currentStreak = 1;
  } else {
    return 0; // Last completion is not today or yesterday, so streak is broken
  }

  // Iterate backwards to find consecutive days
  for (let i = sortedCompletions.length - 2; i >= 0; i--) {
    const prevDate = new Date(sortedCompletions[i]);
    const currDate = new Date(sortedCompletions[i + 1]);

    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
    } else if (diffDays > 1) {
      break; // Gap found, streak broken
    }
    // If diffDays is 0, it's a duplicate, continue
  }
  return currentStreak;
};


const ProfilePage = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [habits, setHabits] = useState([]); // State to store all habits
  const [totalHabits, setTotalHabits] = useState(0);
  const [overallMaxStreak, setOverallMaxStreak] = useState(0);
  const [overallCurrentStreak, setOverallCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user profile and habits on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFromStorage = JSON.parse(localStorage.getItem('user'));
        if (!userFromStorage || !userFromStorage.token) {
          navigate('/login');
          return;
        }

        // Fetch user profile from API
        const userData = await getMe();
        setUser(userData);

        // Fetch habits for statistics
        const habitsData = await getHabits();
        if (Array.isArray(habitsData)) {
          setHabits(habitsData);
        } else {
          setError(habitsData.message || 'Failed to fetch habits for statistics.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile or habits.');
        console.error('Profile/Habits fetch error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate statistics whenever habits change
  useEffect(() => {
    setTotalHabits(habits.length);

    let maxFoundStreak = 0;
    let maxFoundCurrentStreak = 0;

    habits.forEach(habit => {
      const habitMaxStreak = calculateMaxStreak(habit.completions);
      if (habitMaxStreak > maxFoundStreak) {
        maxFoundStreak = habitMaxStreak;
      }

      const habitCurrentStreak = calculateCurrentStreak(habit.completions);
      if (habitCurrentStreak > maxFoundCurrentStreak) {
        maxFoundCurrentStreak = habitCurrentStreak;
      }
    });
    setOverallMaxStreak(maxFoundStreak);
    setOverallCurrentStreak(maxFoundCurrentStreak);
  }, [habits]);


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="message error">{error}</div>;
  }

  if (!user) {
    return <div className="message error">User data not available.</div>;
  }

  return (
    <div className="profile-page">
      <header className="header">
        <h1>Daily Habit Tracker</h1>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/progress-calendar">Progress & Calendar</Link></li>
            <li><button onClick={handleLogout} className="btn btn-outline">Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className="container profile-content">
        <div className="profile-info-card card"> {/* Added 'card' class for consistent styling */}
          <h2>Your Profile</h2>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>Your account details and view your overall habit statistics.</p>
        </div>

        {/* Habit Statistics Section */}
        <div className="profile-stats-grid"> {/* New grid for stats cards */}
          <div className="card profile-stat-card">
            <h3>Total Habits</h3>
            <div className="stat-display">
              <span className="stat-number">{totalHabits}</span>
              <span className="stat-label">Habits Added</span>
            </div>
          </div>

          <div className="card profile-stat-card">
            <h3>Longest Current Streak</h3>
            <div className="stat-display">
              <span className="stat-number">{overallCurrentStreak}</span>
              <span className="stat-label">Days</span>
            </div>
            <p className="summary-message">Your best active streak across all habits.</p>
          </div>

          <div className="card profile-stat-card">
            <h3>Overall Max Streak</h3>
            <div className="stat-display">
              <span className="stat-number">{overallMaxStreak}</span>
              <span className="stat-label">Days</span>
            </div>
            <p className="summary-message">Your all-time best streak across any habit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
