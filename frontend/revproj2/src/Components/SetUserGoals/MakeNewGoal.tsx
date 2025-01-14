import React from 'react';
import { useNavigate } from 'react-router-dom';

function MakeNewGoal() {
  const navigate = useNavigate();
  const handleCreateNew = () => navigate('/goals');
  const handleEditCurrent = () => navigate('/resetGoals');

  return (
    <div
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        minHeight: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
      }}
    >
      <h1 style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '20px' }}>
        YOU'VE COMPLETED YOUR GOAL!
      </h1>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px', 
        width: '80%', 
        maxWidth: '450px', 
        color:'#fff', 
        background:"#000",
        padding:'20px',
        borderRadius: '25px',

        }}>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0px', marginTop: '10px' }}>
        Would you like to edit your current goal and extend the duration?
      </p>
        
        <button
          onClick={handleEditCurrent}
          style={{
            padding: '15px',
            backgroundColor: '#504dff',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            width: '100%',
          }}
        >
          Edit Current Goal
        </button>
        <p style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0px', marginTop: '10px' }}>
            Or would you like to create a new goal and start over?
        </p>
       
        <button
          onClick={handleCreateNew}
          style={{
            padding: '15px',
            backgroundColor: '#ff4444',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            width: '100%',
          }}
        >
          Create New Goal
        </button>
      </div>
    </div>
  );
}

export default MakeNewGoal;
