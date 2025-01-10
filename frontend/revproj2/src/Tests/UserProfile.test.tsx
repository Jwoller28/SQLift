import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../UserProfile';

describe('UserProfile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        localStorage.setItem('token', JSON.stringify('mockToken'));
    });

    it('should retrieve user profile successfully', async () => {
        const mockTokenResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserInfoResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                id: 1,
            }),
        };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockTokenResponse)
            .mockResolvedValueOnce(mockUserInfoResponse);

        const { getByText } = render(<UserProfile />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/me', expect.any(Object));
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/username/testuser', expect.any(Object));
            expect(getByText('Username: testuser')).toBeInTheDocument();
            expect(getByText('First Name: Test')).toBeInTheDocument();
            expect(getByText('Last Name: User')).toBeInTheDocument();
            expect(getByText('Email: test@example.com')).toBeInTheDocument();
        });
    });

    it('should update user profile successfully', async () => {
        const mockTokenResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserInfoResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                id: 1,
            }),
        };
        const mockUpdateResponse = { status: 200 };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockTokenResponse)
            .mockResolvedValueOnce(mockUserInfoResponse)
            .mockResolvedValueOnce(mockUpdateResponse);

        const { getByText, getByLabelText } = render(<UserProfile />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/me', expect.any(Object));
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/username/testuser', expect.any(Object));
        });

        fireEvent.click(getByText('Edit Profile'));

        fireEvent.change(getByLabelText('First Name:'), { target: { value: 'UpdatedFirstName' } });
        fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'UpdatedLastName' } });
        fireEvent.change(getByLabelText('Email:'), { target: { value: 'updated@example.com' } });

        fireEvent.click(getByText('Save changes'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/user/1', expect.any(Object));
            expect(console.log).toHaveBeenCalledWith('here is the editProfileResponseData: ', 200);
        });
    });

    it('should open and close modal', () => {
        const { getByText, queryByText } = render(<UserProfile />);

        fireEvent.click(getByText('Edit Profile'));
        expect(queryByText('Edit Profile')).toBeInTheDocument();

        fireEvent.click(getByText('Close'));
        expect(queryByText('Edit Profile')).not.toBeInTheDocument();
    });
});