import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import InputPage from '../../src/Calendar/InputPage';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ dayId: '2024-12-20' }),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('InputPage', () => {
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
        json: jest.fn().mockResolvedValue({ id: 1 }),
      });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/input/:dayId" element={<InputPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Input Progress for 2024-12-20')).toBeInTheDocument();
    });
  });

  it('handles adding and updating workouts', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/input/:dayId" element={<InputPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Workout'));

    const weightInput = screen.getAllByPlaceholderText('Weight')[0];
    fireEvent.change(weightInput, { target: { value: '100' } });

    const repsInput = screen.getAllByPlaceholderText('Reps')[0];
    fireEvent.change(repsInput, { target: { value: '10' } });

    const setsInput = screen.getAllByPlaceholderText('Sets')[0];
    fireEvent.change(setsInput, { target: { value: '3' } });

    await waitFor(() => {
      expect(weightInput).toHaveValue(100);
      expect(repsInput).toHaveValue(10);
      expect(setsInput).toHaveValue(3);
    });
  });

  it('handles adding and updating foods', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/input/:dayId" element={<InputPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Food'));

    const foodInput = screen.getByPlaceholderText('e.g. mac and cheese');
    fireEvent.change(foodInput, { target: { value: 'apple' } });

    await waitFor(() => {
      expect(foodInput).toHaveValue('apple');
    });
  });

  it('handles fetching nutrition from API', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        items: [
          {
            calories: 95,
            carbohydrates_total_g: 25,
            fat_total_g: 0.3,
            protein_g: 0.5,
          },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/input/:dayId" element={<InputPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Food'));

    const foodInput = screen.getByPlaceholderText('e.g. mac and cheese');
    fireEvent.change(foodInput, { target: { value: 'apple' } });

    fireEvent.click(screen.getByText('Fetch Nutrition from API'));

    await waitFor(() => {
      expect(screen.getByText('Calories: 95 kcal')).toBeInTheDocument();
      expect(screen.getByText('Carbs: 25 g')).toBeInTheDocument();
      expect(screen.getByText('Fat: 0.3 g')).toBeInTheDocument();
      expect(screen.getByText('Protein: 0.5 g')).toBeInTheDocument();
    });
  });

  it('handles saving tracker data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue('mock-username'),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1 }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1 }),
    })
    .mockResolvedValueOnce({
      ok: true,
    });

    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/input/:dayId" element={<InputPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Calories Burned (kcal):'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Hours Slept:'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Water Intake (fl oz.):'), { target: { value: '64' } });
    fireEvent.change(screen.getByLabelText('Weight (lbs):'), { target: { value: '150' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/Tracker', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });
  });

  it('handles navigating to progress page', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/input/:dayId" element={<InputPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('See Progress'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/progress/2024-12-20');
    });
  });
});