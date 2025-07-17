import React from 'react';

const MonthlyCalendar = ({ selectedDate, onDateChange, habits }) => {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const numDaysInMonth = lastDayOfMonth.getDate();

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

  const days = [];

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ type: 'empty' });
  }

  // Add days of the month
  for (let i = 1; i <= numDaysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    date.setHours(0, 0, 0, 0); // Normalize to start of day

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = date.getTime() === today.getTime();
    const isSelected = date.getTime() === selectedDate.getTime();

    // Check if any habit was completed on this specific date
    const hasCompletion = habits.some(habit =>
      habit.completions.some(completionDate => {
        const compDate = new Date(completionDate);
        compDate.setHours(0, 0, 0, 0);
        return compDate.getTime() === date.getTime();
      })
    );

    days.push({
      type: 'day',
      date: date,
      dayNumber: i,
      isToday,
      isSelected,
      hasCompletion,
    });
  }

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleGoToToday = () => {
    onDateChange(new Date()); // Set selected date to today
  };

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-month-view">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="calendar-nav-btn">&lt;</button>
        <h3>{monthName}</h3>
        <button onClick={handleNextMonth} className="calendar-nav-btn">&gt;</button>
      </div>
      <div className="calendar-controls">
        <button onClick={handleGoToToday} className="btn btn-outline btn-today">Today</button>
      </div>
      <div className="calendar-weekdays">
        {weekdays.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day-cell ${day.type === 'empty' ? 'empty' : ''} ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''} ${day.hasCompletion ? 'has-completion' : ''}`}
            onClick={day.type === 'day' ? () => onDateChange(day.date) : null}
          >
            {day.type === 'day' && (
              <>
                <span className="day-number">{day.dayNumber}</span>
                {day.hasCompletion && <div className="completion-indicator"></div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;