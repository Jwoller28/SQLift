import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Inbox from '../../../src/Components/Inbox/Inbox';
import { getUserByUsername, usernameifAuthorized } from '../../../src/API/Axios';
/**
 * @jest-environment jsdom
 */

jest.mock('../../../src/API/Axios', () => ({
  getUserByUsername: jest.fn(),
  usernameifAuthorized: jest.fn(),
}));

describe('Inbox Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render without crashing', () => {
		const { getByText } = render(<Inbox />);
		expect(getByText('NotificationList')).toBeInTheDocument();
	});

	it('should fetch user data on mount', async () => {
		(usernameifAuthorized as jest.Mock).mockResolvedValue('testuser');
		(getUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });

		render(<Inbox />);

		await waitFor(() => {
			expect(getUserByUsername).toHaveBeenCalledWith('testuser');
		});
	});

	it('should handle click and update state', async () => {
		(usernameifAuthorized as jest.Mock).mockResolvedValue('testuser');
		(getUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });

		const { getByText } = render(<Inbox />);

		await waitFor(() => {
			expect(getUserByUsername).toHaveBeenCalledWith('testuser');
		});

		const notificationList = getByText('NotificationList');
		fireEvent.click(notificationList);

		await waitFor(() => {
			expect(getByText('NotiViewerNew')).toBeInTheDocument();
		});
	});
});