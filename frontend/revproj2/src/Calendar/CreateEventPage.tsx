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
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2>Create Event for {dayId}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Assign To:
          <select onChange={(e) => setSelectedGroupId(e.target.value === 'personal' ? -1 : Number(e.target.value))}>
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
        <br />
        <label>
          Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <button type="submit">Create Event</button>
      </form>
      <button onClick={() => navigate(`/day/${dayId}`)}>Back to Day View</button>
    </div>
  );
}

export default CreateEventPage;
