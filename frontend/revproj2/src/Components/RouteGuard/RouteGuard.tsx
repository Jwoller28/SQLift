import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';

interface RouteGuardProps {
	    children: JSX.Element;
}

function RouteGuard({children}: {children: ReactNode}) {
	return <>{children}</>;
}

export default RouteGuard
