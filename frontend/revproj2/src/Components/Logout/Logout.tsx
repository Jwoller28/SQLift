import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';

function Logout() {
    useEffect(() => {
        localStorage.removeItem("token");
    }, []);
  return (
    <div><Navigate to={"/login"} replace/></div>
  )
}

export default Logout