import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ResetGoals from '../ResetGoals';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('ResetGoals', () => {
    const mockNavigate = useNavigate as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        localStorage.setItem('token', JSON.stringify('mockToken'));
    });

    it('should retrieve token from local storage', async () => {
        render(<ResetGoals />);

        await waitFor(() => {
            expect(localStorage.getItem).toHaveBeenCalledWith('token');
        });
    });

    it('should fetch user info', async () => {
        const mockMeResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1 }),
        };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockMeResponse)
            .mockResolvedValueOnce(mockUserResponse);

        render(<ResetGoals />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/me', expect.any(Object));
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/username/testuser', expect.any(Object));
        });
    });

    it('should fetch user goal', async () => {
        const mockMeResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1 }),
        };
        const mockGoalResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                id: 1,
                sleep: 8,
                water: 64,
                nutrition: { kal: 2000, carb: 300, fat: 70, protein: 150, weight: 180 },
                exercise: { caloriesBurned: 500, volume: 100, duration: 60 },
            }),
        };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockMeResponse)
            .mockResolvedValueOnce(mockUserResponse)
            .mockResolvedValueOnce(mockGoalResponse);

        const { getByLabelText } = render(<ResetGoals />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/goalUser/1', expect.any(Object));
            expect(getByLabelText('Calories:')).toHaveValue(2000);
            expect(getByLabelText('Carbs:')).toHaveValue(300);
            expect(getByLabelText('Fat:')).toHaveValue(70);
            expect(getByLabelText('Protein:')).toHaveValue(150);
            expect(getByLabelText('Weight:')).toHaveValue(180);
            expect(getByLabelText('Calories to Burn:')).toHaveValue(500);
            expect(getByLabelText('Volume:')).toHaveValue(100);
            expect(getByLabelText('Duration (min):')).toHaveValue(60);
            expect(getByLabelText('Water (oz):')).toHaveValue(64);
            expect(getByLabelText('Hours of Sleep:')).toHaveValue(8);
        });
    });

    it('should handle form submission and goal update', async () => {
        const mockMeResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1 }),
        };
        const mockGoalResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                id: 1,
                sleep: 8,
                water: 64,
                nutrition: { kal: 2000, carb: 300, fat: 70, protein: 150, weight: 180 },
                exercise: { caloriesBurned: 500, volume: 100, duration: 60 },
            }),
        };
        const mockPatchResponse = { ok: true, json: jest.fn().mockResolvedValue({}) };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockMeResponse)
            .mockResolvedValueOnce(mockUserResponse)
            .mockResolvedValueOnce(mockGoalResponse)
            .mockResolvedValueOnce(mockPatchResponse);

        const { getByLabelText, getByText } = render(<ResetGoals />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/goalUser/1', expect.any(Object));
        });

        fireEvent.change(getByLabelText('Calories:'), { target: { value: 2500 } });
        fireEvent.change(getByLabelText('Carbs:'), { target: { value: 350 } });
        fireEvent.change(getByLabelText('Fat:'), { target: { value: 80 } });
        fireEvent.change(getByLabelText('Protein:'), { target: { value: 160 } });
        fireEvent.change(getByLabelText('Weight:'), { target: { value: 190 } });
        fireEvent.change(getByLabelText('Calories to Burn:'), { target: { value: 600 } });
        fireEvent.change(getByLabelText('Volume:'), { target: { value: 120 } });
        fireEvent.change(getByLabelText('Duration (min):'), { target: { value: 70 } });
        fireEvent.change(getByLabelText('Water (oz):'), { target: { value: 70 } });
        fireEvent.change(getByLabelText('Hours of Sleep:'), { target: { value: 9 } });
        fireEvent.change(getByLabelText('Goal End Date'), { target: { value: '2024-12-31' } });

        fireEvent.click(getByText('Save New Goal'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/goal/1', expect.any(Object));
            expect(mockNavigate).toHaveBeenCalledWith('/calendar');
        });
    });

    it('should handle error fetching user info', async () => {
        const mockMeResponse = { ok: false, status: 401 };

        (fetch as jest.Mock).mockResolvedValueOnce(mockMeResponse);

        const { getByText } = render(<ResetGoals />);

        await waitFor(() => {
            expect(getByText('Error fetching user info (/me): GET /me failed: HTTP 401')).toBeInTheDocument();
        });
    });

    it('should handle error fetching user goal', async () => {
        const mockMeResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1 }),
        };
        const mockGoalResponse = { ok: false, status: 404 };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockMeResponse)
            .mockResolvedValueOnce(mockUserResponse)
            .mockResolvedValueOnce(mockGoalResponse);

        const { getByText } = render(<ResetGoals />);

        await waitFor(() => {
            expect(getByText('You have no existing goal. Creating a new one!')).toBeInTheDocument();
        });
    });

    it('should handle error updating goal', async () => {
        const mockMeResponse = { ok: true, text: jest.fn().mockResolvedValue('testuser') };
        const mockUserResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 1 }),
        };
        const mockGoalResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                id: 1,
                sleep: 8,
                water: 64,
                nutrition: { kal: 2000, carb: 300, fat: 70, protein: 150, weight: 180 },
                exercise: { caloriesBurned: 500, volume: 100, duration: 60 },
            }),
        };
        const mockPatchResponse = { ok: false, status: 400 };

        (fetch as jest.Mock)
            .mockResolvedValueOnce(mockMeResponse)
            .mockResolvedValueOnce(mockUserResponse)
            .mockResolvedValueOnce(mockGoalResponse)
            .mockResolvedValueOnce(mockPatchResponse);

        const { getByText } = render(<ResetGoals />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/goalUser/1', expect.any(Object));
        });

        fireEvent.click(getByText('Save New Goal'));

        await waitFor(() => {
            expect(getByText('Error updating goal: Failed to update goal. Status: 400')).toBeInTheDocument();
        });
    });
});