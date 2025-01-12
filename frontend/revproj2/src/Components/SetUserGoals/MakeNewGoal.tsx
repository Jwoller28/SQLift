import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function MakeNewGoal() {
  const navigate = useNavigate();
  const handleCreateNew = () => {navigate('/goals')};
  const handleEditCurrent = () => {navigate('/resetGoals')};

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>YOUVE COMPLETED YOUR GOAL</h1>
      <p>Would you like to edit your current goal and extend the duration, or would you like to create a new goal and start over?</p>
      <button onClick={handleCreateNew}>Create new goal</button>
      <button onClick={handleEditCurrent}>Edit current goal</button>
    </div>
  );
}


export default MakeNewGoal;
