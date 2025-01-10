import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';

function RouteGuard({children}: {children: ReactNode}) {
const token = localStorage.getItem('token');
let isAuthenticated = "";
if(token)
{
	isAuthenticated = JSON.parse(token);
}
console.log(`Here is isAuthenticated token: ${isAuthenticated}`);
if(!isAuthenticated)
{
	localStorage.removeItem("token");
	return <Navigate to={"/login"} replace/>
}
else
{
	
	return <>{children} : </>;
}
}

export default RouteGuard
