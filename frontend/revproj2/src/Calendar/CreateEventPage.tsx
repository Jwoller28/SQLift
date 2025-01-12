import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroups } from '../Components/GroupContext/GroupContext';
import { useEvents } from '../Components/EventsContext/EventsContext';

function CreateEventPage() {
  const { dayId } = useParams(); // e.g., "2025-01-08"
  const navigate = useNavigate();
  const { myGroups, groups, createGroupEvent } = useGroups();
  const { addEvent } = useEvents(); // Add a personal event function

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dayId || !title.trim() || !description.trim() || selectedGroupId === null) {
      alert('Please fill in all fields and select a group or personal.');
      return;
    }

    try {
      if (selectedGroupId === -1) {
        // Personal event logic
        await addEvent(dayId, title, description); // Calls the personal event logic
        alert('Personal event created successfully!');
      } else {
        // Group event logic
        await createGroupEvent(selectedGroupId, dayId, title, description);
        alert('Group event created successfully!');
      }
      navigate(`/day/${dayId}`);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#2F2F2F',
          padding: '30px',
          borderRadius: '10px',
          color: '#FFFFFF',
          width: '400px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Create Event for {dayId}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>
            Assign To:
            <select
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              onChange={(e) =>
                setSelectedGroupId(
                  e.target.value === 'personal' ? -1 : Number(e.target.value)
                )
              }
            >
              <option value="">Select Group or Personal</option>
              <option value="personal">Personal</option>
              {myGroups.map((groupId) => {
                const group = groups.find((g) => g.id === groupId);
                return group ? (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ) : null;
              })}
            </select>
          </label>

          <label>
            Title:
            <input
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            Description:
            <textarea
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'none',
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28A745',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create Event
          </button>
        </form>

        <button
          onClick={() => navigate(`/day/${dayId}`)}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '10px',
            backgroundColor: '#555',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Day View
        </button>
      </div>
    </div>
  );
}

export default CreateEventPage;
