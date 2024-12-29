import React, { FormEvent, useContext, useState } from 'react'
import UserLogin from './UserLogin';
import { AuthContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';


// Contains the logic for the UserLogin page and what to do with the input/submit button interaction
function UserManagement() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[data, setData] = useState<any | null>(null); // Created to use Jest with api call

    const context = useContext(AuthContext);
    if(!context){
        throw new Error("Login must be used within an AuthProvider")
    }
    const {dispatch} = context;

    // Function to handle submit event on login page
    function handleSubmit(event: FormEvent) {
        event.preventDefault();
      
        const fetchData = async (): Promise<any> => {
          const token = localStorage.getItem('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyNjY3IiwiaWF0IjoxNzM1MjQxMzI5LCJleHAiOjE3MzUyNDQ5Mjl9.g_LcKorlooGtG-P49B20zUdl1pkpVXB_-Yzch3XKpJg'); // Assuming token is stored in localStorage
      
          if (!token) {
            console.error('No token found. Please login first.');
            return; 
          }
      
          const response = await fetch('http://localhost:8080/me', {
            headers: {
              'Authorization': `Bearer ${token}` 
            }
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json(); 
          console.log('Me API Response:', data); 
          // Update state or dispatch action with the fetched data 
        }
        };

    // Function to handle register button on login page, redirect to register page.
    const navigate = useNavigate();
    function handleRegister(event: FormEvent){
        event.preventDefault();
        navigate('/register');
    }

// This return statement uses UserLogin page as its display and populates the data it needs to display.
  return (
    <>
        <UserLogin username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleSubmit={handleSubmit} handleRegister={handleRegister}/>
    </>
  )
}

export default UserManagement