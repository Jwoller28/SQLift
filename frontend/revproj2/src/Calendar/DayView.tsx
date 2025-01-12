import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useEvents } from '../Components/EventsContext/EventsContext';
import { useGroups, GroupEvent } from '../Components/GroupContext/GroupContext';

function DayView() {
  const navigate = useNavigate();
  const { dayId } = useParams();  // e.g. "2025-01-08"

  // personal events
  const { events: personalEvents } = useEvents();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { groups, myGroups, fetchGroupEvents, createGroupEvent } = useGroups();


  // We'll store the merged events for display
  const [allEvents, setAllEvents] = useState<Array<{id: number; title: string; description: string; group?: boolean; groupName?: string;}>>([]);

  useEffect(() => {
    if (!dayId) return;

    async function loadEventsForDay() {
      const personalForDay = personalEvents
        .filter((evt) => evt.day === dayId)
        .map((evt) => ({ ...evt, group: false, groupName: 'Personal Event' })); // Add groupName
    
      let groupE: Array<{ id: number; title: string; description: string; group: boolean; groupName?: string }> = [];
      for (const gId of myGroups) {
        const gEvents: GroupEvent[] = await fetchGroupEvents(gId);
        const group = groups.find((g) => g.id === gId); // Find the group name
        const dayEvents = gEvents
          .filter((ge) => ge.day === dayId)
          .map((ge) => ({
            id: ge.id,
            title: ge.title,
            description: ge.description,
            group: true,
            groupName: group ? group.name : 'Unknown Group', // Include group name
          }));
        groupE = groupE.concat(dayEvents);
      }
    
      setAllEvents([...personalForDay, ...groupE]);
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
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '50px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
      style={{
        marginBottom: '20px',
        background: 'linear-gradient(to bottom, #2F2F2F , #2F2F2F )',
        padding: '50px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        
      <h2>All Events for {dayId}</h2>

      {allEvents.map((evt) => (
        <div
          key={evt.id}
          style={{
            marginBottom: '10px',
            fontSize: 18,
            marginTop: '10px',
            padding: '15px 85px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#504dff',
          }}
        >
          <strong>{evt.title}</strong>
          <p>{evt.description}</p>
          <strong style={{ fontStyle: 'italic' }}>{evt.groupName}</strong> {/* Display group or personal */}
        </div>
      ))}


      {/* Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={goBackToCalendar}
          style={{
            margin: '10px 10px',
          padding: '10px 10px',
          backgroundColor: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          }}
        >
          Back to Calendar
        </button>

        <button
        onClick={() => navigate(`/createEvent/${dayId}`)}
        style={{
          margin: '10px 10px',
          padding: '10px 10px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Create New Event
      </button>

        {/* If the day is future => show "Go to Progress" */}
        {isFutureDay ? (
          <button
            onClick={goToProgress}
            style={{
              margin: '10px 10px',
              padding: '10px 10px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
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
              margin: '10px 10px',
              padding: '10px 10px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Input
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

export default DayView;
