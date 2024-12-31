import React, { ReactNode } from 'react'
import { useAuth } from '../UserContext/UserContext';
import { Navigate } from 'react-router-dom';

interface RouteGuardProps {
    children: JSX.Element;
}

function RouteGuard({children}: {children: ReactNode}) {
    const {isAuthenticated} = useAuth();

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    return <>{children}</>;
}

export default RouteGuard