import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import CalendarPage from '../../src/Calendar/CalendarPage';
import { EventsProvider } from '../../src/Components/EventsContext/EventsContext';
import { GroupProvider } from '../../src/Components/GroupContext/GroupContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('CalendarPage', () => {
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
          createdAt: '2024-01-01',
          sleepDate: '2025-12-31',
        }),
      });

    render(
      <MemoryRouter>
        <EventsProvider>
          <GroupProvider>
            <CalendarPage />
          </GroupProvider>
        </EventsProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('January 2025')).toBeInTheDocument();
    });
  });

  it('navigates to the previous month', async () => {
    render(
      <MemoryRouter>
        <EventsProvider>
          <GroupProvider>
            <CalendarPage />
          </GroupProvider>
        </EventsProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Prev Month'));

    await waitFor(() => {
      expect(screen.getByText('December 2024')).toBeInTheDocument();
    });
  });

  it('navigates to the next month', async () => {
    render(
      <MemoryRouter>
        <EventsProvider>
          <GroupProvider>
            <CalendarPage />
          </GroupProvider>
        </EventsProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Next Month'));

    await waitFor(() => {
      expect(screen.getByText('February 2025')).toBeInTheDocument();
    });
  });

  it('handles day click and navigates to day view', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <EventsProvider>
          <GroupProvider>
            <CalendarPage />
          </GroupProvider>
        </EventsProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('1'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/day/2025-01-01');
    });
  });

  it('fetches personal events and group events', async () => {
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
        json: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(
      <MemoryRouter>
        <EventsProvider>
          <GroupProvider>
            <CalendarPage />
          </GroupProvider>
        </EventsProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('January 2025')).toBeInTheDocument();
    });
  });
});