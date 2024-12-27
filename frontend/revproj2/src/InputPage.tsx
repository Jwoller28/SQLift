import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function InputPage() {
  const { dayId } = useParams(); // Get the dayId from the URL
  const navigate = useNavigate();

  // Form states for each input
  const [calories, setCalories] = useState('');
  const [hoursSlept, setHoursSlept] = useState('');
  const [waterIntake, setWaterIntake] = useState('');

  const handleSave = () => {
    // Logic to save progress (send data to backend or update state)
    console.log(`Saving progress for ${dayId}:`, { calories, hoursSlept, waterIntake });
    navigate('/'); // Redirect back to the calendar
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Input Progress for {dayId}</h2>
      <form>
        <label>
          Calories:
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </label>
        <br />
        <label>
          Hours Slept:
          <input
            type="number"
            value={hoursSlept}
            onChange={(e) => setHoursSlept(e.target.value)}
          />
        </label>
        <br />
        <label>
          Water Intake (oz):
          <input
            type="number"
            value={waterIntake}
            onChange={(e) => setWaterIntake(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleSave}>
          Save Progress
        </button>
      </form>
    </div>
  );
}

export default InputPage;
