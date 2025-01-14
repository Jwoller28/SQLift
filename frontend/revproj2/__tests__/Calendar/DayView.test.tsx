import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DayView from '../../src/Calendar/DayView';
import { useEvents } from '../../src/Components/EventsContext/EventsContext';
import { useGroups } from '../../src/Components/GroupContext/GroupContext';

jest.mock('../../src/Components/EventsContext/EventsContext');
jest.mock('../../src/Components/GroupContext/GroupContext');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ dayId: '2025-01-30' }),
}));

describe('DayView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    (useEvents as jest.Mock).mockReturnValue({ events: [] });
    (useGroups as jest.Mock).mockReturnValue({ groups: [], myGroups: [], fetchGroupEvents: jest.fn() });

    render(
      <MemoryRouter>
        <DayView />
      </MemoryRouter>
    );

    expect(screen.getByText('All Events for 2025-01-30')).toBeInTheDocument();
  });

  it('loads personal events correctly', async () => {
    (useEvents as jest.Mock).mockReturnValue({
      events: [{ id: 1, title: 'Personal Event 1', description: 'Description 1', day: '2025-01-30' }],
    });
    (useGroups as jest.Mock).mockReturnValue({ groups: [], myGroups: [], fetchGroupEvents: jest.fn() });

    render(
      <MemoryRouter>
        <DayView />
      </MemoryRouter>
    );

    expect(await screen.findByText('Personal Event 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Personal Event')).toBeInTheDocument();
  });

  it('loads group events correctly', async () => {
    (useEvents as jest.Mock).mockReturnValue({ events: [] });
    (useGroups as jest.Mock).mockReturnValue({
      groups: [{ id: 1, name: 'Group 1' }],
      myGroups: [1],
      fetchGroupEvents: jest.fn().mockResolvedValue([{ id: 2, title: 'Group Event 1', description: 'Description 2', day: '2025-01-30' }]),
    });

    render(
      <MemoryRouter>
        <DayView />
      </MemoryRouter>
    );

    expect(await screen.findByText('Group Event 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('Group 1')).toBeInTheDocument();
  });

  it('navigates to the correct routes when buttons are clicked', () => {
    (useEvents as jest.Mock).mockReturnValue({ events: [] });
    (useGroups as jest.Mock).mockReturnValue({ groups: [], myGroups: [], fetchGroupEvents: jest.fn() });

    render(
      <MemoryRouter>
        <DayView />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Back to Calendar'));
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');

    fireEvent.click(screen.getByText('Create New Event'));
    expect(mockNavigate).toHaveBeenCalledWith('/createEvent/2025-01-30');
  });

  it('correctly identifies future days', () => {
    (useEvents as jest.Mock).mockReturnValue({ events: [] });
    (useGroups as jest.Mock).mockReturnValue({ groups: [], myGroups: [], fetchGroupEvents: jest.fn() });

    render(
      <MemoryRouter>
        <DayView />
      </MemoryRouter>
    );

    expect(screen.getByText('Go to Progress')).toBeInTheDocument();
  });
});