import React, { useContext } from 'react'
import { AuthContext } from '../UserContext/UserContext';

function LoginLandingPage() {
    const context = useContext(AuthContext);
        if(!context){
            throw new Error("Login must be used within an AuthProvider")
        }
        const {state, dispatch} = context;
        console.log('Here is the user info: ', state.user);
  return (
    <div>LoginLandingPage
    </div>
  )
}

export default LoginLandingPage