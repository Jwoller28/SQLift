import React from 'react';
import { render } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import Logout from '../Logout';

jest.mock('react-router-dom', () => ({
    Navigate: jest.fn(() => null),
}));

describe('Logout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'mockToken');
    });

    it('should remove token from local storage', () => {
        render(<Logout />);

        expect(localStorage.getItem('token')).toBeNull();
    });

    it('should redirect to login page', () => {
        render(<Logout />);

        expect(Navigate).toHaveBeenCalledWith({ to: '/login', replace: true }, {});
    });
});