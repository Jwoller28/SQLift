import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CalendarPage() {
  const navigate = useNavigate();

  // Store current date for the calendar view
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

  let taskStatuses: { [key: string]: string } = {
    '2024-12-16': 'completed',
    '2024-12-17': 'completed',
    '2024-12-18': 'completed',
    '2024-12-19': 'completed',
    '2024-12-20': 'missed',
    '2024-12-21': 'completed',
    '2024-12-22': 'completed',
    '2024-12-23': 'missed',
    '2024-12-24': 'completed',
    '2024-12-25': 'completed',
    '2024-12-26': 'completed',
    '2024-12-30': 'end_date',
  };

  // Get the background color for a specific day
  const getDayColor = (dayId: string) => {
    if (taskStatuses[dayId] === 'missed') return '#ff0000'; // Red
    if (taskStatuses[dayId] === 'end_date') return '#800080'; // Purple
    if (taskStatuses[dayId] === 'completed') return '#008000'; // Green
    if (dayId === todayFormatted) return '#FFEB3B'; // Yellow for today
    return '#0080ff'; // Default blue
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Format the dayId to YYYY-MM-DD
  const handleDayClick = (dayNumber: number) => {
    const formattedDay = String(dayNumber).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dayId = `${year}-${formattedMonth}-${formattedDay}`; // Always YYYY-MM-DD
    if (formattedDay > String(today.getDate())) {
      navigate(`/progress/${dayId}`);
    } else {
      navigate(`/input/${dayId}`);
    }
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div
      style={{
        padding: '0px',
        background: 'linear-gradient(to bottom, #3370ff, #ADD8E6)',
        color: '#000000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ fontFamily: 'Arial, sans-serif', color: '#ffffff', fontSize: '50px'}}>
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={goToPrevMonth}
          style={{
            padding: '10px 20px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Prev Month
        </button>
        <button
          onClick={goToNextMonth}
          style={{
            padding: '10px 20px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Next Month
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'black',
          padding: '20px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 100px)', // Increased size for larger calendar
            gap: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: '20px',
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 100px)', // Larger cells
            gap: '10px',
          }}
        >
          {calendarCells.map((cell, index) => {
            if (cell === null) {
              return (
                <div
                  key={index}
                  style={{
                    height: '100px',
                    border: '1px solid #ccc',
                    background: '#b0c4de',
                  }}
                />
              );
            } else {
              const formattedDay = String(cell).padStart(2, '0');
              const formattedMonth = String(month + 1).padStart(2, '0');
              const dayId = `${year}-${formattedMonth}-${formattedDay}`;
              const backgroundColor = getDayColor(dayId);

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(cell)}
                  style={{
                    height: '100px',
                    border: '1px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: backgroundColor,
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'background 0.3s, transform 0.2s',
                  }}
                >
                  {cell}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
