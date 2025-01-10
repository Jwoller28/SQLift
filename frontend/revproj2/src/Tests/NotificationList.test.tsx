import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import NotificationList from '../NotificationList';
import { getGoalsbyUserId, usernameifAuthorized, getUserByUsername } from '../../../API/Axios';
import { useNavigate } from 'react-router-dom';

jest.mock('../../../API/Axios');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('NotificationList', () => {
    const mockGetGoalsbyUserId = getGoalsbyUserId as jest.Mock;
    const mockUsernameifAuthorized = usernameifAuthorized as jest.Mock;
    const mockGetUserByUsername = getUserByUsername as jest.Mock;
    const mockNavigate = useNavigate as jest.Mock;

    const mockHandleClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch goals before today', async () => {
        const goals = [
            { id: 1, waterDate: new Date().toISOString() },
            { id: 2, waterDate: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
        ];
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockGetUserByUsername.mockResolvedValue({ id: 1 });
        mockGetGoalsbyUserId.mockResolvedValue(goals);

        const { getByText } = render(<NotificationList handleClick={mockHandleClick} />);

        await waitFor(() => {
            expect(mockUsernameifAuthorized).toHaveBeenCalled();
            expect(mockGetUserByUsername).toHaveBeenCalledWith('testuser');
            expect(mockGetGoalsbyUserId).toHaveBeenCalledWith(1);
            expect(getByText('Goal ID : 1')).toBeInTheDocument();
            expect(getByText('Goal ID : 2')).toBeInTheDocument();
        });
    });

    it('should render goals', async () => {
        const goals = [
            { id: 1, waterDate: new Date().toISOString() },
            { id: 2, waterDate: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
        ];
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockGetUserByUsername.mockResolvedValue({ id: 1 });
        mockGetGoalsbyUserId.mockResolvedValue(goals);

        const { getByText } = render(<NotificationList handleClick={mockHandleClick} />);

        await waitFor(() => {
            expect(getByText('Goal ID : 1')).toBeInTheDocument();
            expect(getByText('Goal ID : 2')).toBeInTheDocument();
        });
    });

    it('should handle click events', async () => {
        const goals = [
            { id: 1, waterDate: new Date().toISOString() },
            { id: 2, waterDate: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
        ];
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockGetUserByUsername.mockResolvedValue({ id: 1 });
        mockGetGoalsbyUserId.mockResolvedValue(goals);

        const { getByText } = render(<NotificationList handleClick={mockHandleClick} />);

        await waitFor(() => {
            expect(getByText('Goal ID : 1')).toBeInTheDocument();
            expect(getByText('Goal ID : 2')).toBeInTheDocument();
        });

        fireEvent.click(getByText('Goal ID : 1'));

        expect(mockHandleClick).toHaveBeenCalled();
    });
});