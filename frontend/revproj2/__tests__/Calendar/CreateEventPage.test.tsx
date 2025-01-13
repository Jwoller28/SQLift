import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest, describe, beforeEach, expect, test } from '@jest/globals';
import CreateEventPage from '../../src/Calendar/CreateEventPage';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroups } from '../../src/Components/GroupContext/GroupContext';
import { useEvents } from '../../src/Components/EventsContext/EventsContext';

jest.mock('react-router-dom', () => {
  const actualRouterDom = jest.requireActual('react-router-dom');
  return {
    ...actualRouterDom,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock('../../src/Components/GroupContext/GroupContext', () => ({
  useGroups: jest.fn(),
}));

jest.mock('../../src/Components/EventsContext/EventsContext', () => ({
  useEvents: jest.fn(),
}));

describe('CreateEventPage', () => {
  const mockNavigate = useNavigate as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const mockUseGroups = useGroups as jest.Mock;
  const mockUseEvents = useEvents as jest.Mock;

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseParams.mockReturnValue({ dayId: '2025-01-08' });
    
    mockUseGroups.mockReturnValue({
      myGroups: [1, 2],
      groups: [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' },
      ],
      createGroupEvent: jest.fn(),
    });

    mockUseEvents.mockReturnValue({
      addEvent: jest.fn(),
    });
  });

  test('renders create event page', () => {
    render(<CreateEventPage />);
    expect(screen.getByText(/Create Event for 2025-01-08/i));
    expect(screen.getByText(/Assign To:/i));
    expect(screen.getByText(/Title:/i));
    expect(screen.getByText(/Description:/i));
  });

  test('submits form for personal event', async () => {
    const mockAddEvent = mockUseEvents.mockReturnValue({ addEvent: jest.fn() }).addEvent;
    render(<CreateEventPage />);

    fireEvent.change(screen.getByLabelText(/Assign To:/i), { target: { value: 'personal' } });
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });

    fireEvent.click(screen.getByText(/Create Event/i));

    await waitFor(() => {
      expect(mockAddEvent).toHaveBeenCalledWith('2025-01-08', 'Test Title', 'Test Description');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/day/2025-01-08');
  });

  test('submits form for group event', async () => {
    const mockCreateGroupEvent = mockUseGroups.mockReturnValue({
      createGroupEvent: jest.fn(),
    }).createGroupEvent;
    
    render(<CreateEventPage />);

    fireEvent.change(screen.getByLabelText(/Assign To:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });

    fireEvent.click(screen.getByText(/Create Event/i));

    await waitFor(() => {
      expect(mockCreateGroupEvent).toHaveBeenCalledWith(1, '2025-01-08', 'Test Title', 'Test Description');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/day/2025-01-08');
  });

  test('navigates back to day view', () => {
    render(<CreateEventPage />);
    fireEvent.click(screen.getByText(/Back to Day View/i));
    expect(mockNavigate).toHaveBeenCalledWith('/day/2025-01-08');
  });
});
