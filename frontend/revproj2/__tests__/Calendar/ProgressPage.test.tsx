import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ProgressPage from '../../src/Calendar/ProgressPage';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ dayId: '2024-12-20' }),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('ProgressPage', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify('mock-token'));
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly and fetches user data', async () => {
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
          nutrition: { weight: 150, kal: 2000 },
          exercise: { caloriesBurned: 500, duration: 60, volume: 1000 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          {
            id: 1,
            sleep: 8,
            sleepDate: '2024-12-20',
            water: 64,
            waterDate: '2024-12-20',
            nutrition: {
              weight: 150,
              kal: 2000,
              carb: 250,
              fat: 70,
              protein: 100,
              nutritionDate: '2024-12-20',
            },
            exercise: {
              caloriesBurned: 500,
              volume: 1000,
              duration: 60,
              exerciseDate: '2024-12-20',
            },
          },
        ]),
      });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/progress/:dayId" element={<ProgressPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Progress for 2024-12-20')).toBeInTheDocument();
      expect(screen.getByText('Sleep (hrs): 8')).toBeInTheDocument();
      expect(screen.getByText('Water (oz): 64')).toBeInTheDocument();
      expect(screen.getByText('Calories Burned: 500')).toBeInTheDocument();
      expect(screen.getByText('Volume: 1000')).toBeInTheDocument();
      expect(screen.getByText('Duration: 60 min')).toBeInTheDocument();
      expect(screen.getByText('Weight (lbs): 150')).toBeInTheDocument();
      expect(screen.getByText('Calories Consumed (kal): 2000 min')).toBeInTheDocument();
      expect(screen.getByText('Carbs (g): 250')).toBeInTheDocument();
      expect(screen.getByText('Fat (g): 70')).toBeInTheDocument();
      expect(screen.getByText('Protein (g): 100')).toBeInTheDocument();
    });
  });

  it('handles no data for the day', async () => {
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
          nutrition: { weight: 150, kal: 2000 },
          exercise: { caloriesBurned: 500, duration: 60, volume: 1000 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/progress/:dayId" element={<ProgressPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No data for this day.')).toBeInTheDocument();
    });
  });

  it('handles navigating back to the calendar', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/progress/:dayId" element={<ProgressPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Back to Calendar'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });
  });
});