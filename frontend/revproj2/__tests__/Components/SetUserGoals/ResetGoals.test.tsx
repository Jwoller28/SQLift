import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ResetGoals from '../../../src/Components/SetUserGoals/ResetGoals';
/**
 * @jest-environment jsdom
 */

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('ResetGoals', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify('mock-token'));
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly and handles form submission', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue('mock-username'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 1,
          sleep: 8,
          water: 64,
          nutrition: { kal: 2000, carb: 300, fat: 70, protein: 150, weight: 70 },
          exercise: { caloriesBurned: 500, volume: 100, duration: 60 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

    render(
      <MemoryRouter>
        <ResetGoals />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset or Update Goal')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Calories:'), { target: { value: '2500' } });
    fireEvent.change(screen.getByLabelText('Carbs:'), { target: { value: '350' } });
    fireEvent.change(screen.getByLabelText('Fat:'), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText('Protein:'), { target: { value: '160' } });
    fireEvent.change(screen.getByLabelText('Weight:'), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText('Calories to Burn:'), { target: { value: '600' } });
    fireEvent.change(screen.getByLabelText('Volume:'), { target: { value: '120' } });
    fireEvent.change(screen.getByLabelText('Duration (min):'), { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText('Water (oz):'), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText('Hours of Sleep:'), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText('Goal End Date'), { target: { value: '2023-12-31' } });

    fireEvent.click(screen.getByText('Save New Goal'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/goal/1', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });
  });

  it('displays error message on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <MemoryRouter>
        <ResetGoals />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching user info (/me): Fetch error')).toBeInTheDocument();
    });
  });
});