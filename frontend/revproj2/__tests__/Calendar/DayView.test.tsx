import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, jest, describe, beforeEach, it, expect,  } from '@jest/globals';
import DayView from '../../src/Calendar/DayView';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../../src/Components/EventsContext/EventsContext';
import { useGroups } from '../../src/Components/GroupContext/GroupContext';

jest.mock('react-router-dom', () => {
    const actualRouterDom = jest.requireActual('react-router-dom');
    return {
      actualRouterDom,
      useNavigate: jest.fn(),
      useParams: jest.fn(),
    };
  });

jest.mock('../Components/EventsContext/EventsContext', () => ({
  useEvents: jest.fn(),
}));

jest.mock('../Components/GroupContext/GroupContext', () => ({
  useGroups: jest.fn(),
}));

describe('DayView', () => {
  const mockNavigate = useNavigate as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const mockUseEvents = useEvents as jest.Mock;
  const mockUseGroups = useGroups as jest.Mock;

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseParams.mockReturnValue({ dayId: '2025-01-08' });
    mockUseEvents.mockReturnValue({
      events: [
        { id: 1, title: 'Personal Event 1', description: 'Description 1', day: '2025-01-08' },
        { id: 2, title: 'Personal Event 2', description: 'Description 2', day: '2025-01-08' },
      ],
    });
    mockUseGroups.mockReturnValue({
      groups: [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' },
      ],
      myGroups: [1, 2],
      fetchGroupEvents: jest.fn<() => Promise<{ id: number; title: string; description: string; day: string; }[]>>().mockResolvedValue([
        { id: 3, title: 'Group Event 1', description: 'Description 3', day: '2025-01-08' },
      ]),
      createGroupEvent: jest.fn(),
    });
  });

  test('renders day view', () => {
    render(<DayView />);
    expect(screen.getByText(/Day View for 2025-01-08/i));
    expect(screen.getByText(/All Events for This Day/i));
  });

  test('fetches and displays events', async () => {
    render(<DayView />);

    await waitFor(() => {
      expect(screen.getByText(/Personal Event 1/i));
      expect(screen.getByText(/Description 1/i));
      expect(screen.getByText(/Personal Event 2/i));
      expect(screen.getByText(/Description 2/i));
      expect(screen.getByText(/Group Event 1/i));
      expect(screen.getByText(/Description 3/i));
    });
  });

  test('navigates to input view', () => {
    render(<DayView />);
    fireEvent.click(screen.getByText(/Go to Input/i));
    expect(mockNavigate).toHaveBeenCalledWith('/input/2025-01-08');
  });

  test('navigates to progress view', () => {
    mockUseParams.mockReturnValue({ dayId: '2025-12-31' });
    render(<DayView />);
    fireEvent.click(screen.getByText(/Go to Progress/i));
    expect(mockNavigate).toHaveBeenCalledWith('/progress/2025-12-31');
  });

  test('navigates to create event view', () => {
    render(<DayView />);
    fireEvent.click(screen.getByText(/Create New Event/i));
    expect(mockNavigate).toHaveBeenCalledWith('/createEvent/2025-01-08');
  });

  test('navigates back to calendar view', () => {
    render(<DayView />);
    fireEvent.click(screen.getByText(/Back to Calendar/i));
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });
});
