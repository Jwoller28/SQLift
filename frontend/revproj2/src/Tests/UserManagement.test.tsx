import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../UserContext/UserContext';
import UserManagement from '../UserManagement';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('UserManagement', () => {
    const mockNavigate = useNavigate as jest.Mock;
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            dispatch: mockDispatch,
        }));
    });

    it('should login user successfully', async () => {
        const { getByLabelText, getByText } = render(
            <AuthContext.Provider value={{ dispatch: mockDispatch }}>
                <UserManagement />
            </AuthContext.Provider>
        );

        const usernameInput = getByLabelText('Username:');
        const passwordInput = getByLabelText('Password:');
        const submitButton = getByText('Submit');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        const mockLoginResponse = {
            ok: true,
            text: jest.fn().mockResolvedValue('mockToken'),
        };

        (fetch as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN', payload: { username: 'testuser', password: 'password' } });
            expect(mockNavigate).toHaveBeenCalledWith('/calendar');
        });
    });

    it('should handle login failure', async () => {
        const { getByLabelText, getByText } = render(
            <AuthContext.Provider value={{ dispatch: mockDispatch }}>
                <UserManagement />
            </AuthContext.Provider>
        );

        const usernameInput = getByLabelText('Username:');
        const passwordInput = getByLabelText('Password:');
        const submitButton = getByText('Submit');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        const mockLoginResponse = {
            ok: false,
            status: 401,
        };

        (fetch as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
            expect(mockDispatch).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('should navigate to register page', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ dispatch: mockDispatch }}>
                <UserManagement />
            </AuthContext.Provider>
        );

        const registerButton = getByText('Register');

        fireEvent.click(registerButton);

        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});