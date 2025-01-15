import { Navigate } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import React from 'react';

type UserLoginProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: any;
  handleRegister: any;
};

function UserLogin({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  handleRegister,
}: UserLoginProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ff6bcb, #504dff)",
        minHeight: "90vh",
        maxHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Create space between logo and login box
        padding: "0 10%",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          width: "70%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundImage: `url('logo/logo-transparent-png.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '1000px', // Adjust the width
            height: '1000px', // Adjust the height
            transform: 'translate(-50px, -50px)',
          }}
        ></div>
      </div>

      {/* Login Form Section */}
      <div
        style={{
          backgroundColor: "#000",
          padding: "30px",
          borderRadius: "10px",
          color: "#fff",
          width: "40%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontSize: '150%',
          fontFamily: 'Georgia',
        }}
      >
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: '175%', }}>Trackr</h2>
          <label style={{ display: "block", marginBottom: "10px" }}>
            Username:
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "20px" }}>
            Password:
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <button
              type="submit"
              style={{
                flex: "1",
                padding: "10px",
                backgroundColor: "#504dff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              onClick={handleRegister}
              type="button"
              style={{
                flex: "1",
                padding: "10px",
                backgroundColor: "#ff6bcb",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
