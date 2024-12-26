import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from './Components/EventsContext/EventsContext';

function WeekView() {
  const navigate = useNavigate();
  
  // Gets the function from your EventsContext 
  // that allows retrieving events for a specific day.
  // For instance, getEventsForDay('2024-12-25') might return an array of events.
  const { getEventsForDay } = useEvents();

  // 1) Set up local state for the "start" of the current week.
  // By default, we find the most recent Sunday as the week's start.
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday=0, Monday=1, etc.
    const newDate = new Date(now);
    // Move 'newDate' back 'dayOfWeek' days to get Sunday
    newDate.setDate(now.getDate() - dayOfWeek);
    // Set time to midnight for consistency
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  });

  /**
   * Helper: returns an array of 7 Date objects
   * starting from 'startOfWeek'.
   */
  function getWeekDates(startOfWeek: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }

  // 2) Navigate to previous/next week by subtracting/adding 7 days
  const goToPrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  // 3) Build array of 7 days for this week
  const weekDates = getWeekDates(currentWeekStart);

  // 4) On clicking a day, navigate to /day/:dayId
  const handleDayClick = (dayStr: string) => {
    navigate(`/day/${dayStr}`);
  };

  // 5) Optional button to go back to the main Calendar
  const handleCalendarButton = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e4e',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h2>Weekly View</h2>

      {/* NAVIGATION BUTTONS */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={goToPrevWeek}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Prev Week
        </button>
        
        <button
          onClick={goToNextWeek}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Next Week
        </button>

        <button
          onClick={handleCalendarButton}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Back to Calendar
        </button>
      </div>

      {/* GRID OF 7 DAYS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
        }}
      >
        {weekDates.map((dateObj, index) => {
          // Format a short date label (e.g., "Sun, Jan 15")
          const dayLabel = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          // If you want your DayView to use a specific date format (e.g. 'YYYY-MM-DD'):
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1; // 1-based
          const day = dateObj.getDate();
          const dayId = `${year}-${month}-${day}`; // e.g. "2024-1-15"

          // Retrieve any events for that day
          const events = getEventsForDay(dayId);
          console.log(events);
          
          return (
            <div
              key={index}
              onClick={() => handleDayClick(dayId)}
              style={{
                backgroundColor: '#2c2c54',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{dayLabel}</div>
              {/* List out events or say "No events" */}
              {events.length === 0 ? (
                <div style={{ fontStyle: 'italic', fontSize: '0.9em' }}>
                  No events
                </div>
              ) : (
                events.map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      marginTop: '5px',
                      padding: '5px',
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '1px solid #555',
                      borderRadius: '2px',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{evt.title}</div>
                    <div style={{ fontSize: '0.85em' }}>{evt.description}</div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView;
