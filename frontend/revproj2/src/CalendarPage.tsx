import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CalendarPage() {
  const navigate = useNavigate();

  // 1) Store "currentDate" for the calendar view
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based in JS

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarCells: Array<number | null> = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // UPDATED: Format the dayId to YYYY-MM-DD
  const handleDayClick = (dayNumber: number) => {
    const formattedDay = String(dayNumber);
    const formattedMonth = String(month + 1);
    const dayId = `${year}-${formattedMonth}-${formattedDay}`; // e.g., "2024-12-07"
    navigate(`/day/${dayId}`);
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleWeekButton = () => {
    navigate('/week');
  };

  return (
    <div
      style={{
        padding: '20px',
        background: 'linear-gradient(to bottom, #3370ff, #ADD8E6)',
        color: '#000000',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ fontFamily: 'Arial, sans-serif', color: '#ffffff' }}>
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={goToPrevMonth}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Prev Month
        </button>

        <button
          onClick={goToNextMonth}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Next Month
        </button>

        <button
          onClick={handleWeekButton}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
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
          color: '#ffffff',
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
            return (
              <div
                key={index}
                style={{
                  height: '60px',
                  border: '1px solid #ccc',
                  background: '#b0c4de',
                }}
              />
            );
          } else {
            return (
              <div
                key={index}
                onClick={() => handleDayClick(cell)}
                style={{
                  height: '60px',
                  border: '1px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#0080ff',
                  color: '#ffffff',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  transition: 'background 0.3s, transform 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = '#0056b3')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = '#0080ff')
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = 'scale(0.95)')
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
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
