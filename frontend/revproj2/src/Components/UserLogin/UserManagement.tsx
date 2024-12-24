import React, { FormEvent, useContext, useState } from 'react'
import UserLogin from './UserLogin';
import { AuthContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';


// Contains the logic for the UserLogin page and what to do with the input/submit button interaction
function UserManagement() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

    const context = useContext(AuthContext);
    if(!context){
        throw new Error("Login must be used within an AuthProvider")
    }
    const {dispatch} = context;

    // Function to handle submit event on login page
    function handleSubmit(event: FormEvent){
        event.preventDefault();
        dispatch({type: 'LOGIN', payload: {username, password}})
        console.log(username, password);
    }

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