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
  // If you want server search: you'd do an endpoint or pass searchTerm to the server
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
          </div>
        ))
      )}
    </div>
  );
}

export default GroupPage;
