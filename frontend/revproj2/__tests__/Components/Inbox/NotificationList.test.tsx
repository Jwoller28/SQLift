import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationList from '../../../src/Components/Inbox/NotificationList';
import { getGoalsbyUserId, usernameifAuthorized, getUserByUsername } from '../../../src/API/Axios';
/**
 * @jest-environment jsdom
 */

jest.mock('../../../src/API/Axios', () => ({
    getUserByUsername: jest.fn(),
    usernameifAuthorized: jest.fn(),
    getGoalsbyUserId: jest.fn(),
  }));
describe('NotificationList Component', () => {
	const mockHandleClick = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render without crashing', () => {
		const { getByText } = render(<NotificationList handleClick={mockHandleClick} />);
		expect(getByText('Goal ID')).toBeInTheDocument();
	});

	it('should fetch goals on mount', async () => {
		const mockGoals = [
			{
				id: 1,
				user_id: 1,
				createdAt: new Date(),
				sleep: 8,
				water: 2,
				sleepDate: new Date(),
				waterDate: new Date(),
				exercise: { duration: 30, volume: 100, calories: 200, ExerciseDate: new Date() },
				nutrition: { Kal: 2000, fat: 50, carb: 250, weight: 70, protein: 100, NutritionDate: new Date() },
			},
		];

		(usernameifAuthorized as jest.Mock).mockResolvedValue('testuser');
		(getUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });
		(getGoalsbyUserId as jest.Mock).mockResolvedValue(mockGoals);

		const { getByText } = render(<NotificationList handleClick={mockHandleClick} />);

		await waitFor(() => {
			expect(getUserByUsername).toHaveBeenCalledWith('testuser');
			expect(getGoalsbyUserId).toHaveBeenCalledWith(1);
			expect(getByText('Goal ID : 1')).toBeInTheDocument();
		});
	});

	it('should handle click and call handleClick prop', async () => {
		const mockGoals = [
			{
				id: 1,
				user_id: 1,
				createdAt: new Date(),
				sleep: 8,
				water: 2,
				sleepDate: new Date(),
				waterDate: new Date(),
				exercise: { duration: 30, volume: 100, calories: 200, ExerciseDate: new Date() },
				nutrition: { Kal: 2000, fat: 50, carb: 250, weight: 70, protein: 100, NutritionDate: new Date() },
			},
		];

		(usernameifAuthorized as jest.Mock).mockResolvedValue('testuser');
		(getUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });
		(getGoalsbyUserId as jest.Mock).mockResolvedValue(mockGoals);

		const { getByText } = render(<NotificationList handleClick={mockHandleClick} />);

		await waitFor(() => {
			expect(getByText('Goal ID : 1')).toBeInTheDocument();
		});

		const goalDiv = getByText('Goal ID : 1').parentElement;
		if (goalDiv) {
			fireEvent.click(goalDiv);
		}

		expect(mockHandleClick).toHaveBeenCalled();
	});
});