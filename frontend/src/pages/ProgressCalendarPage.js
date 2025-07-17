import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getHabits } from '../api';
import MonthlyCalendar from '../components/MonthlyCalendar'; // Assuming this component exists

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

const ProgressCalendarPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for calendar selected date
  const [username, setUsername] = useState('');
  const [overallMaxStreak, setOverallMaxStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      navigate('/login');
    } else {
      setUsername(user.username);
      fetchHabits();
    }
  }, [navigate]);

  useEffect(() => {
    let maxFoundStreak = 0;
    habits.forEach(habit => {
      const habitStreak = calculateMaxStreak(habit.completions);
      if (habitStreak > maxFoundStreak) {
        maxFoundStreak = habitStreak;
      }
    });
    setOverallMaxStreak(maxFoundStreak);
  }, [habits]);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      if (Array.isArray(data)) {
        setHabits(data);
      } else {
        setError(data.message || 'Failed to fetch habits.');
      }
    } catch (err) {
      setError('Failed to fetch habits. Please try again.');
      console.error('Fetch habits error:', err);
      if (err.message && err.message.includes('401')) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getHabitsForSelectedDate = () => {
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    return habits.map(habit => {
      const isCompletedOnSelectedDay = habit.completions.some(completionDate => {
        const compDate = new Date(completionDate);
        compDate.setHours(0, 0, 0, 0);
        return compDate.getTime() === selectedDay.getTime();
      });
      return { ...habit, isCompletedOnSelectedDay };
    });
  };

  const filteredHabitsForSelectedDate = getHabitsForSelectedDate();
  const habitsCompletedOnSelectedDate = filteredHabitsForSelectedDate.filter(h => h.isCompletedOnSelectedDay).length;
  const totalHabitsOnSelectedDate = filteredHabitsForSelectedDate.length;

  return (
    <div className="progress-calendar-page">
      <header className="header">
        <h1>Daily Habit Tracker</h1>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="btn btn-outline">Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className="container progress-calendar-grid-container">
        <h2 className="page-title">Your Progress & Calendar</h2>

        {/* Progress and Streak Cards */}
        <div className="progress-calendar-stats-grid">
          <div className="card daily-summary-card">
            <h3>Progress for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{habitsCompletedOnSelectedDate}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{totalHabitsOnSelectedDate}</span>
                <span className="stat-label">Total Habits</span>
              </div>
            </div>
            {totalHabitsOnSelectedDate > 0 && habitsCompletedOnSelectedDate === totalHabitsOnSelectedDate && (
              <p className="summary-message success-message">All habits completed for this day! 🎉</p>
            )}
            {totalHabitsOnSelectedDate > 0 && habitsCompletedOnSelectedDate < totalHabitsOnSelectedDate && (
              <p className="summary-message">Keep going! You're doing great.</p>
            )}
            {totalHabitsOnSelectedDate === 0 && (
              <p className="summary-message">No habits tracked for this day.</p>
            )}
          </div>

          <div className="card max-streak-card">
            <h3>Your Best Streak</h3>
            <div className="max-streak-display">
              <span className="stat-number">{overallMaxStreak}</span>
              <span className="stat-label">Days</span>
            </div>
            <p className="summary-message">Keep building those streaks!</p>
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="card calendar-overview-card progress-calendar-full-width">
          {loading && <p>Loading calendar...</p>}
          {error && <div className="message error">{error}</div>}
          {!loading && !error && (
            <MonthlyCalendar
              habits={habits}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressCalendarPage;