import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from './Components/EventsContext/EventsContext';

function DayView() {
  const navigate = useNavigate();
  const { dayId } = useParams();
  const { addEvent, getEventsForDay } = useEvents();

  // Local state for our form inputs
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Return only events for this day
  const eventsToday = dayId ? getEventsForDay(dayId) : [];

  // Handler for form submission
  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!dayId) return;
    addEvent(dayId, title, desc);
    setTitle('');
    setDesc('');
  }

  const handleCalendarButton = () => {
    navigate('/calendar');
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e4e', // Dark blue background
        color: '#ffffff',           // White text
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h2 style={{ marginBottom: '10px' }}>Day View</h2>
      <p>
        You clicked on day: <strong>{dayId}</strong>
      </p>

      <h3 style={{ marginTop: '30px' }}>Add an Event</h3>
      <form
        onSubmit={handleAddEvent}
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '300px',
        }}
      >
        <label style={{ marginBottom: '5px' }}>
          Title:
          <input
            style={{
              display: 'block',
              width: '100%',
              marginTop: '5px',
              marginBottom: '10px',
              padding: '8px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label style={{ marginBottom: '5px' }}>
          Description:
          <input
            style={{
              display: 'block',
              width: '100%',
              marginTop: '5px',
              marginBottom: '10px',
              padding: '8px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
            }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Add Event
          </button>
          <button
            type="button"
            onClick={handleCalendarButton}
            style={{
              padding: '8px 16px',
              backgroundColor: '#555',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back to Calendar
          </button>
        </div>
      </form>

      <h3>Events for This Day</h3>
      {eventsToday.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>No events yet for this day.</p>
      ) : (
        eventsToday.map((event) => (
          <div
            key={event.id}
            style={{
              border: '1px solid #555',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#2c2c54',
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {event.title}
            </p>
            <p>{event.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default DayView;
