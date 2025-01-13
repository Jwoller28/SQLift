import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../src/Components/UserContext/UserContext';
import { useNavigate } from 'react-router-dom';

function LoginLandingPage() {
  const [token, setToken] = useState(""); // Creating useState variable for token
  const navigate = useNavigate();

  useEffect(() => { // This useEffect will be called on render to grab token from local storage
    const sessionTok = localStorage.getItem('token');
    if(sessionTok){
      setToken(JSON.parse(sessionTok));
      }
     navigate("/calendar");
     
    
  }, []);

  useEffect(() => { // This useEffect checks our me endpoint in springboot to see if current user token is valid.
    const userValidToken = async () =>{
      const responseValidToken = await fetch("http://localhost:8080/me", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`,
            'Access-Control-Allow-Origin': "*"
            },
            credentials : 'include'
    });

    const userToken = await responseValidToken.text();
    console.log(userToken);

    }
    userValidToken();
  }, [token]);
  
  const context = useContext(AuthContext);
  console.log("Here is token: ",token);
  if(!context){
      throw new Error("Login must be used within an AuthProvider")
  }
  const {state, dispatch} = context;

  return (
    <div>LoginLandingPage
    </div>
  )
}

export default LoginLandingPage
