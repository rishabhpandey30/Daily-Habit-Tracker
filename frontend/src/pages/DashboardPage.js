import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getHabits } from '../api';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';

const DashboardPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate] = useState(new Date()); // Still needed for HabitList filtering
  const [username, setUsername] = useState('');
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

  const fetchHabits = async () => {
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
  };

  const handleHabitAdded = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const handleHabitUpdate = (updatedHabit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => (habit._id === updatedHabit._id ? updatedHabit : habit))
    );
  };

  const handleHabitDelete = (deletedHabitId) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit._id !== deletedHabitId));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getHabitsForSelectedDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return habits.map(habit => {
      const isCompletedOnSelectedDay = habit.completions.some(completionDate => {
        const compDate = new Date(completionDate);
        compDate.setHours(0, 0, 0, 0);
        return compDate.getTime() === today.getTime();
      });
      return { ...habit, isCompletedOnSelectedDay };
    });
  };

  const filteredHabits = getHabitsForSelectedDate();

  return (
    <div className="dashboard-page">
      <header className="header">
        <h1>Daily Habit Tracker</h1>
        <nav>
          <ul>
            <li><Link to="/progress-calendar">Progress & Calendar</Link></li> {/* Updated link */}
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="btn btn-outline">Logout</button></li>
          </ul>
        </nav>
      </header>
      <div className="container dashboard-grid-container">
        <div className="card welcome-card dashboard-span-full">
          <h2 className="welcome-title-small">Welcome back, {username}!</h2>
          <p>Let's make today count. Track your progress and build consistent habits.</p>
        </div>

        {/* Habit Form and List now take the main content area */}
        <div className="dashboard-full-width-content"> {/* New class for full width content */}
          <HabitForm onHabitAdded={handleHabitAdded} />
          <h2>Your Habits for Today</h2>
          {loading && <p>Loading habits...</p>}
          {error && <div className="message error">{error}</div>}
          <HabitList
            habits={filteredHabits}
            onHabitUpdate={handleHabitUpdate}
            onHabitDelete={handleHabitDelete}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;