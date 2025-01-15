import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserRegistration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [photo_url, setPhotoUrl] = useState('');
  const [token, setToken] = useState('');
  const [id, setId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Stores registered user's token in browser
    localStorage.setItem('token', JSON.stringify(token));
  }, [token]);

  useEffect(() => {
    localStorage.setItem('id', JSON.stringify(id));
  }, [id]);

  const registerSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, first_name, last_name, photo_url }),
    });

    if (!response.ok) {
      alert(`Error Registering User! Error Code: ${response.status}`);
    } else {
      const data = await response.json();
      setId(data.id);
      loginUserAfterRegister();
    }
  };

  const loginUserAfterRegister = async () => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      alert(`Failed to Log user in after registering with error code: ${response.status}`);
    } else {
      const token = await response.text();
      setToken(token);
      navigate('/goals');
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10%',
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          width: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundImage: `url('https://2126-proj2-frontend.s3.us-east-2.amazonaws.com/Logo/logo-transparent-png.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '1000px',
            height: '1000px',
            transform: 'translate(-50px, -50px)',
          }}
        ></div>
      </div>

      {/* Registration Form Section */}
      <div
        style={{
          backgroundColor: '#000',
          padding: '30px',
          borderRadius: '10px',
          color: '#fff',
          width: '40%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '150%',
          fontFamily: 'Georgia',
        }}
      >
        <form onSubmit={registerSubmit}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '175%' }}>Register</h2>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            Username:
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            Password:
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            First Name:
            <input
              type="text"
              placeholder="Enter First Name"
              value={first_name}
              onChange={(e: any) => setFirstName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '10px' }}>
            Last Name:
            <input
              type="text"
              placeholder="Enter Last Name"
              value={last_name}
              onChange={(e: any) => setLastName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '20px' }}>
            Email:
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </label>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <button
              type="submit"
              style={{
                flex: '1',
                padding: '10px',
                backgroundColor: '#504dff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
            <button
              onClick={() => navigate('/login')}
              type="button"
              style={{
                flex: '1',
                padding: '10px',
                backgroundColor: '#ff6bcb',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserRegistration;
