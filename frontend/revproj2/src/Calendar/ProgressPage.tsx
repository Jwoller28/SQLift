import React from 'react';
import { useParams } from 'react-router-dom';

function ProgressPage() {
  const { dayId } = useParams(); // Get the dayId from the URL

  // Example progress data (replace with actual data fetching logic)
  const progressData = {
    calories: 1500,
    hoursSlept: 7,
    waterIntake: 64,
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Progress for {dayId}</h2>
      <p>
        <strong>Calories:</strong> {progressData.calories} kcal
      </p>
      <p>
        <strong>Hours Slept:</strong> {progressData.hoursSlept} hours
      </p>
      <p>
        <strong>Water Intake:</strong> {progressData.waterIntake} oz
      </p>
    </div>
  );
}

export default ProgressPage;
