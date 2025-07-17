import React, { useState } from 'react'; // Import useState
import { completeHabit, incompleteHabit, deleteHabit, updateHabit } from '../api'; // Import updateHabit

const HabitCard = ({ habit, onHabitUpdate, onHabitDelete, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedTimeOfDay, setEditedTimeOfDay] = useState(habit.timeOfDay);

  const today = new Date(selectedDate);
  today.setHours(0, 0, 0, 0);

  const isCompletedToday = habit.completions.some(completionDate => {
    const compDate = new Date(completionDate);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === today.getTime();
  });

  const handleToggleComplete = async () => {
    let updatedHabit;
    if (isCompletedToday) {
      updatedHabit = await incompleteHabit(habit._id);
    } else {
      updatedHabit = await completeHabit(habit._id);
    }
    if (updatedHabit._id) {
      onHabitUpdate(updatedHabit);
    } else {
      console.error('Failed to update habit completion:', updatedHabit.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const result = await deleteHabit(habit._id);
      if (result.id) {
        onHabitDelete(habit._id);
      } else {
        console.error('Failed to delete habit:', result.message);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(habit.name); // Reset to original values
    setEditedTimeOfDay(habit.timeOfDay);
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) {
      alert('Habit name cannot be empty.');
      return;
    }
    try {
      const updated = await updateHabit(habit._id, editedName, editedTimeOfDay);
      if (updated._id) {
        onHabitUpdate(updated); // Update the habit in the parent state
        setIsEditing(false); // Exit edit mode
      } else {
        alert(updated.message || 'Failed to update habit.');
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      alert('Network error or server issue while updating habit.');
    }
  };

  return (
    <div className={`habit-card ${isCompletedToday ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="habit-edit-form">
          <div className="form-group">
            <label htmlFor={`edit-name-${habit._id}`}>Name</label>
            <input
              type="text"
              id={`edit-name-${habit._id}`}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`edit-time-${habit._id}`}>Time</label>
            <select
              id={`edit-time-${habit._id}`}
              value={editedTimeOfDay}
              onChange={(e) => setEditedTimeOfDay(e.target.value)}
            >
              <option value="any">Anytime</option>
              <option value="morning">Morning</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div className="habit-actions">
            <button className="btn" onClick={handleSaveEdit}>Save</button>
            <button className="btn btn-outline" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="habit-info">
            <h4>{habit.name}</h4>
            <p className="habit-time">{habit.timeOfDay === 'any' ? 'Anytime' : habit.timeOfDay}</p>
            <p className="habit-streak">
              <span style={{ marginRight: '5px' }} role="img" aria-label="fire">🔥</span>
              Streak: {habit.streak} days
            </p>
          </div>
          <div className="habit-actions">
            <button
              className={`btn ${isCompletedToday ? 'btn-outline' : ''}`}
              onClick={handleToggleComplete}
              disabled={new Date().setHours(0,0,0,0) < today.getTime()}
            >
              {isCompletedToday ? 'Undo' : 'Complete'}
            </button>
            <button className="btn btn-outline" onClick={handleEditClick}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default HabitCard;