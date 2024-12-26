import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CalendarPage() {
  const navigate = useNavigate();

  // 1) Store "currentDate" for the calendar view.
  // By default, it starts at today's date.
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2) Extract year, month from our currentDate
  // Months are 0-based in JS, so January=0, February=1, etc.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 

  // 3) Compute the first day of this month
  const firstDayOfMonth = new Date(year, month, 1);
  // And the weekday of that first day (0=Sunday, 1=Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // 4) Compute how many days are in this month
  // We can pass 0 as the day to get "one day before next month".
  // E.g. new Date(2023, 8, 0) is the last day of August if 8 is September.
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // 5) Create an array representing all days in the calendar grid,
  // including blank cells for days before the first dayOfMonth.
  const calendarCells: Array<number | null> = [];

  // Fill in null for days before the first day
  // (if firstDayOfWeek=0 [Sunday], no leading blanks are needed)
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }

  // Then push the real day numbers
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // 6) Handle navigation to day view
  const handleDayClick = (dayNumber: number) => {
    navigate(`/day/${dayNumber}`);
  };

  // 7) Month Navigation (prev/next)
  const goToPrevMonth = () => {
    // Set currentDate to previous month
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    // Set currentDate to next month
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleWeekButton = () => {
    navigate('/week');
  };

  // 8) Build the calendar UI
  return (
    <div style={{ padding: '20px' }}>
      <h2>
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={goToPrevMonth}>Prev Month</button>
        <button onClick={goToNextMonth}>Next Month</button>
        <button onClick={handleWeekButton} style={{ marginLeft: '20px' }}>
          Go to Weekly View
        </button>
      </div>

      {/* Grid for weekdays header (Sun, Mon, Tue, etc.) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 80px)',
          gap: '5px',
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '5px',
        }}
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar days */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 80px)',
          gap: '5px',
        }}
      >
        {calendarCells.map((cell, index) => {
          if (cell === null) {
            // an empty cell
            return (
              <div
                key={index}
                style={{
                  height: '60px',
                  border: '1px solid #ccc',
                  background: '#f0f0f0',
                }}
              />
            );
          } else {
            // a real day
            return (
              <div
                key={index}
                onClick={() => handleDayClick(cell)}
                style={{
                  height: '60px',
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#fff',
                }}
              >
                {cell}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default CalendarPage;
