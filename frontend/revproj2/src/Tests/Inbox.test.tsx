import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import Inbox from '../Inbox';
import { getUserByUsername, usernameifAuthorized } from '../../../API/Axios';
import NotificationList from '../NotificationList';
import NotiViewerNew from '../NotiViewerNew';

jest.mock('../../../API/Axios');
jest.mock('../NotificationList', () => jest.fn(() => null));
jest.mock('../NotiViewerNew', () => jest.fn(() => null));

describe('Inbox', () => {
    const mockGetUserByUsername = getUserByUsername as jest.Mock;
    const mockUsernameifAuthorized = usernameifAuthorized as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch user data on mount', async () => {
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockGetUserByUsername.mockResolvedValue({ id: 1 });

        render(<Inbox />);

        await waitFor(() => {
            expect(mockUsernameifAuthorized).toHaveBeenCalled();
            expect(mockGetUserByUsername).toHaveBeenCalledWith('testuser');
        });
    });

    it('should render NotificationList and NotiViewerNew components', () => {
        const { getByText } = render(<Inbox />);

        expect(NotificationList).toHaveBeenCalledWith({ handleClick: expect.any(Function) }, {});
        expect(NotiViewerNew).toHaveBeenCalledWith({ userId: 0, goalId: 0, clicked: false }, {});
    });

    it('should handle click events', async () => {
        const { getByText } = render(<Inbox />);

        const mockEvent = { target: { getAttribute: jest.fn().mockReturnValue('1') } };
        const handleClick = NotificationList.mock.calls[0][0].handleClick;

        fireEvent.click(getByText('Goal ID : 1'));

        await waitFor(() => {
            handleClick(mockEvent);
            expect(mockEvent.target.getAttribute).toHaveBeenCalledWith('a-key');
            expect(console.log).toHaveBeenCalledWith('1');
        });
    });
});