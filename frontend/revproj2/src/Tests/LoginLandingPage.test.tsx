import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../UserContext/UserContext';
import LoginLandingPage from '../LoginLandingPage';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('LoginLandingPage', () => {
    const mockNavigate = useNavigate as jest.Mock;
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        localStorage.setItem('token', JSON.stringify('mockToken'));
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            state: {},
            dispatch: mockDispatch,
        }));
    });

    it('should retrieve token from local storage and navigate to calendar', async () => {
        const mockTokenResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };

        (fetch as jest.Mock).mockResolvedValueOnce(mockTokenResponse);

        render(
            <AuthContext.Provider value={{ state: {}, dispatch: mockDispatch }}>
                <LoginLandingPage />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(localStorage.getItem).toHaveBeenCalledWith('token');
            expect(mockNavigate).toHaveBeenCalledWith('/calendar');
        });
    });

    it('should validate token', async () => {
        const mockTokenResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };

        (fetch as jest.Mock).mockResolvedValueOnce(mockTokenResponse);

        render(
            <AuthContext.Provider value={{ state: {}, dispatch: mockDispatch }}>
                <LoginLandingPage />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/me', expect.any(Object));
            expect(console.log).toHaveBeenCalledWith('testuser');
        });
    });

    it('should throw error if context is not provided', () => {
        jest.spyOn(React, 'useContext').mockImplementation(() => null);

        expect(() => render(<LoginLandingPage />)).toThrow('Login must be used within an AuthProvider');
    });
});