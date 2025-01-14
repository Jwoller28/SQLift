import React, { useState } from 'react';
import { useGroups, Group } from '../Components/GroupContext/GroupContext';
import { useNavigate } from 'react-router-dom';

function GroupPage() {
  const navigate = useNavigate();
  const { groups, myGroups, createGroup, joinGroup, leaveGroup, fetchGroups } = useGroups();
  
  // local states for creation & search
  const [newGroupName, setNewGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // We'll do a simple search client-side 
  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    await createGroup(newGroupName.trim());
    setNewGroupName('');
  }

  // quick function to see if user is in group
  function isUserInGroup(g: Group) {
    return myGroups.includes(g.id);
  }

  return (
<<<<<<< HEAD
    <div style={{ padding: '20px' }}>
      <h2>Groups</h2>
      <form role = "form" onSubmit={handleCreateGroup} style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          Create Group:
          <input 
            style={{ marginLeft: '5px' }}
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </label>
        <button type="submit">Create</button>
      </form>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          Search:
          <input 
            style={{ marginLeft: '5px' }}
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* RENDER GROUPS */}
      {filteredGroups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        filteredGroups.map((g) => (
          <div key={g.id} style={{ 
            marginBottom: '10px', 
            border: '1px solid #ccc', 
            padding: '10px',
          }}>
            <strong>{g.name}</strong>
            <div>
              {isUserInGroup(g) ? (
                <button onClick={() => leaveGroup(g.id)}>
                  Leave
                </button>
              ) : (
                <button onClick={() => joinGroup(g.id)}>
                  Join
                </button>
              )}
            </div>
=======
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
      margin: 0,
      minHeight: '91vh',
      color: '#ffffff',
      display: 'flex',
    }}>
      <div style={{
        width: '80%',
        maxWidth: '1000px', 
        margin: '0 auto',
      }}>
        <h1 style={{ textAlign: 'center', fontSize:'300%' }}>Groups</h1>
        <div style={{
          backgroundColor: '#000',
          padding: '20px',
          fontSize: '20px',
          marginBottom: '20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          width: '50%',
          margin: '0 auto',
          position: 'relative',
        }}>
          <form onSubmit={handleCreateGroup} style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px' }}>
              Create Group:
              <input
                style={{ marginLeft: '5px' }}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </label>
            <button type="submit">Create</button>
          </form>
  
          {/* SEARCH BAR */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px' }}>
              Search:
              <input
                style={{ marginLeft: '5px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
>>>>>>> origin/main
          </div>
        </div>
  
        {/* RENDER GROUPS */}
        {filteredGroups.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No groups found.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '20px'
          }}>
            {filteredGroups.map((g) => (
              <div key={g.id} style={{
                background: '#fff',
                color: '#000',
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}>
                <strong style={{ fontSize: '40px', fontFamily: 'Georgia' }}>{g.name}</strong>
                <div style={{ marginTop: '10px' }}>
                  {isUserInGroup(g) ? (
                    <button
                      style={{
                        padding: '5px 10px',
                        background: '#ff6bcb',
                        border: 'none',
                        borderRadius: '5px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '30px',
                      }}
                      onClick={() => leaveGroup(g.id)}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      style={{
                        padding: '5px 10px',
                        background: '#504dff',
                        border: 'none',
                        borderRadius: '5px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '25px',
                        fontFamily: 'Georgia',
                      }}
                      onClick={() => joinGroup(g.id)}
                    >
                      JOIN
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );  
}

export default GroupPage;
