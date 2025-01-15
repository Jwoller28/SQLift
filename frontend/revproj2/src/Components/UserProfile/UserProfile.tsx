import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sessionTok = localStorage.getItem('token');
    if (sessionTok) setToken(JSON.parse(sessionTok));
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const tokenResponse = await fetch('http://localhost:8081/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.text();
        setUsername(tokenData);
      } else console.log('TOKEN INVALID!!!');
    };
    checkToken();
  }, [token]);

  useEffect(() => {
    if (!username || !token) return;

    const getUserInfo = async () => {
      try {
        const userInfoResponse = await fetch(
          `http://localhost:8081/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userInfoResponse.ok) {
          alert(
            `Something went wrong getting user info: ERROR CODE ${userInfoResponse.status}`
          );
        } else {
          const userInfoData = await userInfoResponse.json();
          setFirstName(userInfoData.first_name || '');
          setLastName(userInfoData.last_name || '');
          setEmail(userInfoData.email || '');
          setUserId(userInfoData.id);
        }
      } catch (err) {
        console.error('Error getting user info:', err);
      }
    };
    getUserInfo();
  }, [username, token, showModal]);

  function updateProfile() {
    const editUserProfile = async () => {
      const editProfileResponse = await fetch(
        `http://localhost:8081/user/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ first_name, last_name, email }),
        }
      );

      if (editProfileResponse.ok) {
        setShowModal(false);
      } else {
        alert('Error updating profile.');
      }
    };
    editUserProfile();
  }

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleUpdateGoal = () => navigate('/resetGoals');

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        minHeight: '100vh',
        padding: '40px',
        color: '#fff',
        fontFamily: 'Georgia',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ fontSize: '350%' }}>Your Profile</h1>

      <div
        style={{
          backgroundColor: '#000',
          padding: '20px',
          borderRadius: '10px',
          width: '35%',
          fontSize: '140%',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginTop: '20px',
        }}
      >
        {username && (
          <p>
            <strong>Username:</strong> {username}
          </p>
        )}
        {first_name && (
          <p>
            <strong>First Name:</strong> {first_name}
          </p>
        )}
        {last_name && (
          <p>
            <strong>Last Name:</strong> {last_name}
          </p>
        )}
        {email && (
          <p>
            <strong>Email:</strong> {email}
          </p>
        )}
        <button
          onClick={handleOpenModal}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#504dff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Edit Profile
        </button>
        <button
          onClick={handleUpdateGoal}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#ff6bcb',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Current Goal
        </button>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              width: '400px',
              padding: '20px',
              color: '#000',
              textAlign: 'center',
            }}
          >
            <h2>Edit Profile</h2>
            <form>
              <label>
                First Name:
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    margin: '10px 0',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    margin: '10px 0',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    margin: '10px 0',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                />
              </label>
            </form>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  marginRight: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ccc',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                onClick={updateProfile}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#504dff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
