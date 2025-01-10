import React from 'react';
import { render } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import RouteGuard from '../RouteGuard';

jest.mock('react-router-dom', () => ({
    Navigate: jest.fn(() => null),
}));

describe('RouteGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to login page when not authenticated', () => {
        localStorage.removeItem('token');

        render(
            <RouteGuard>
                <div>Protected Content</div>
            </RouteGuard>
        );

        expect(localStorage.getItem('token')).toBeNull();
        expect(Navigate).toHaveBeenCalledWith({ to: '/login', replace: true }, {});
    });

    it('should render children when authenticated', () => {
        localStorage.setItem('token', JSON.stringify('mockToken'));

        const { getByText } = render(
            <RouteGuard>
                <div>Protected Content</div>
            </RouteGuard>
        );

        expect(getByText('Protected Content')).toBeInTheDocument();
    });
});