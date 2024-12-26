import React from 'react';
import { useParams } from 'react-router-dom';

function DayView() {
  const { dayId } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Day View</h2>
      <p>You clicked on day: <strong>{dayId}</strong></p>
      {/* 
        Here we can fetch data for this day from your backend,
        display logs, etc. 
      */}
    </div>
  );
}

export default DayView;
