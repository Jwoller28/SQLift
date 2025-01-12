import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import personal events logic
import { useEvents } from '../Components/EventsContext/EventsContext';
// Import group events logic
import { useGroups, GroupEvent } from '../Components/GroupContext/GroupContext';

function WeekView() {
  const navigate = useNavigate();

  const { getEventsForDay } = useEvents();              // personal events
  const { getAllGroupEventsForDay } = useGroups();      // group events

  // We'll fetch userId from localStorage or from your AuthContext
  const userId = Number(localStorage.getItem('id') || 0);

  // Track the start date (Sunday) of the current week
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday=0, Monday=1, etc.
    const newDate = new Date(now);
    newDate.setDate(now.getDate() - dayOfWeek);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  });

  // We'll store the merged events in a map dayId -> array of events
  const [weekEventsMap, setWeekEventsMap] = useState<{
    [dayId: string]: Array<{ id: number; title: string; description: string; group?: boolean }>;
  }>({});

  // Helper: returns an array of 7 Date objects
  function getWeekDates(startOfWeek: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }

  // Navigate to previous/next week
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

  // On clicking a day, we go to /day/:dayId
  // (Though your logic might be “past day => /input/:dayId, future => /progress/:dayId” if you prefer.)
  const handleDayClick = (dayStr: string) => {
    navigate(`/day/${dayStr}`);
  };

  // Optional button to go back to the main Calendar
  const handleCalendarButton = () => {
    navigate('/calendar');
  };

  // Build array of 7 days for this week
  const weekDates = getWeekDates(currentWeekStart);

  // On mount or when currentWeekStart changes, load merged events for these 7 days
  useEffect(() => {
    async function loadWeekEvents() {
      const newMap: {
        [dayId: string]: Array<{ id: number; title: string; description: string; group?: boolean }>;
      } = {};
      for (let i = 0; i < 7; i++) {
        const dateObj = new Date(currentWeekStart);
        dateObj.setDate(currentWeekStart.getDate() + i);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dayId = `${year}-${month}-${day}`;

        // 1) Personal events
        const personalEvents = getEventsForDay(dayId);

        // 2) Group events
        let groupEvents: GroupEvent[] = [];
        if (userId) {
          groupEvents = await getAllGroupEventsForDay(dayId, userId);
        }

        // Merge them into a single array
        const merged = [
          ...personalEvents.map((evt) => ({ ...evt, group: false })),
          ...groupEvents.map((gevt) => ({
            id: gevt.id,
            title: gevt.title,
            description: gevt.description,
            group: true,
          })),
        ];

        newMap[dayId] = merged;
      }
      setWeekEventsMap(newMap);
    }
    loadWeekEvents();
  }, [currentWeekStart, getEventsForDay, getAllGroupEventsForDay, userId]);

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

          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const dayId = `${year}-${month}-${day}`;

          const events = weekEventsMap[dayId] || [];

          // If there's at least one group event, we could color the tile differently
          // Or if you have "completed" logic, you'd do it here as well
          const hasGroupEvent = events.some((e) => e.group);

          // Decide tile color
          const tileBg = hasGroupEvent ? '#ff4444' : '#2c2c54';

          return (
            <div
              key={index}
              onClick={() => handleDayClick(dayId)}
              style={{
                backgroundColor: tileBg,
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{dayLabel}</div>
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
                    {evt.group && (
                      <div style={{ fontSize: '0.7em', fontStyle: 'italic' }}>
                        (Group Event)
                      </div>
                    )}
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
