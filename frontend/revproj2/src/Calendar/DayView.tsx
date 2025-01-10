import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useEvents } from '../Components/EventsContext/EventsContext';
import { useGroups, GroupEvent } from '../Components/GroupContext/GroupContext';

function DayView() {
  const navigate = useNavigate();
  const { dayId } = useParams();  // e.g. "2025-01-08"

  // personal events
  const { events: personalEvents } = useEvents();
  // group events
  const { myGroups, fetchGroupEvents } = useGroups();

  // We'll store the merged events for display
  const [allEvents, setAllEvents] = useState<Array<{id: number; title: string; description: string; group?: boolean}>>([]);

  useEffect(() => {
    if (!dayId) return;

    async function loadEventsForDay() {
      // 1) Personal events for this day:
      const personalForDay = personalEvents.filter((evt) => evt.day === dayId)
        .map((evt) => ({ ...evt, group: false }));

      // 2) Group events for this day:
      let groupE: Array<{ id: number; title: string; description: string; group: boolean }> = [];
      for (const gId of myGroups) {
        const gEvents: GroupEvent[] = await fetchGroupEvents(gId);
        const dayEvents = gEvents
          .filter((ge) => ge.day === dayId)
          .map((ge) => ({ 
            id: ge.id, 
            title: ge.title, 
            description: ge.description, 
            group: true 
          }));
        groupE = groupE.concat(dayEvents);
      }

      const merged = [...personalForDay, ...groupE];
      setAllEvents(merged);
    }
    loadEventsForDay();
  }, [dayId, personalEvents, myGroups, fetchGroupEvents]);

  // Decide if the day is future or not
  const [isFutureDay, setIsFutureDay] = useState(false);

  useEffect(() => {
    if (!dayId) return;
    // e.g. dayId = "2025-01-08"
    const parts = dayId.split('-');
    if (parts.length === 3) {
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1; // 0-based
      const d = Number(parts[2]);
      const dateObj = new Date(y, m, d, 0, 0, 0);
      const now = new Date();
      now.setHours(0,0,0,0);
      // if day is strictly greater than now => future
      if (dateObj.getTime() > now.getTime()) {
        setIsFutureDay(true);
      } else {
        setIsFutureDay(false);
      }
    }
  }, [dayId]);

  // Handlers for navigating to input or progress
  function goToInput() {
    // e.g. /input/2025-01-08
    if (dayId) {
      navigate(`/input/${dayId}`);
    }
  }
  function goToProgress() {
    if (dayId) {
      navigate(`/progress/${dayId}`);
    }
  }

  function goBackToCalendar() {
    navigate('/calendar');
  }

  return (
    <div
      style={{
        backgroundColor: '#1e1e4e',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h2>Day View for {dayId}</h2>

      <h3>All Events for This Day</h3>
      {allEvents.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>No events for this day.</p>
      ) : (
        allEvents.map((evt) => (
          <div
            key={evt.id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: evt.group ? '#3c3c8c' : '#2c2c54',
            }}
          >
            <strong>{evt.title}</strong>
            <p>{evt.description}</p>
            {evt.group && <p style={{ fontStyle: 'italic' }}>(Group Event)</p>}
          </div>
        ))
      )}

      {/* Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={goBackToCalendar}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Back to Calendar
        </button>

        {/* If the day is future => show "Go to Progress" */}
        {isFutureDay ? (
          <button
            onClick={goToProgress}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go to Progress
          </button>
        ) : (
          // Otherwise show "Go to Input"
          <button
            onClick={goToInput}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go to Input
          </button>
        )}
      </div>
    </div>
  );
}

export default DayView;
