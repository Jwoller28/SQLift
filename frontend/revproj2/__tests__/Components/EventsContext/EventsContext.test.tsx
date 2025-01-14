import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventsProvider, useEvents } from '../../../src/Components/EventsContext/EventsContext';

// Mock the fetch API
global.fetch = jest.fn();

describe('EventsContext', () => {
  const TestComponent = () => {
    const { events, addEvent, getEventsForDay, fetchPersonalEvents } = useEvents();
    return (
      <div>
        <button onClick={() => addEvent('2023-10-10', 'Test Event', 'Description')}>Add Event</button>
        <button onClick={fetchPersonalEvents}>Fetch Events</button>
        <div>{events.length}</div>
        <div>{getEventsForDay('2023-10-10').length}</div>
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should provide events context', () => {
    const { getByText } = render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );

    expect(getByText('0')).toBeInTheDocument();
  });

  it('should add an event', async () => {
    const mockEvent = { id: 1, day: '2023-10-10', title: 'Test Event', description: 'Description' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvent,
    });

    const { getByText, getByRole } = render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );

    const addButton = getByRole('button', { name: /add event/i });
    addButton.click();

    await waitFor(() => {
      expect(getByText('1')).toBeInTheDocument();
      expect(getByText('Test Event')).toBeInTheDocument();
    });
  });

  it('should fetch personal events', async () => {
    const mockEvents = [
      { id: 1, day: '2023-10-10', title: 'Mock Event', description: 'Mock Description' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const { getByText, getByRole } = render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );

    const fetchButton = getByRole('button', { name: /fetch events/i });
    fetchButton.click();

    await waitFor(() => {
      expect(getByText('1')).toBeInTheDocument();
      expect(getByText('Mock Event')).toBeInTheDocument();
    });
  });

  it('should get events for a specific day', async () => {
    const mockEvent = { id: 1, day: '2023-10-10', title: 'Test Event', description: 'Description' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvent,
    });

    const { getByText, getByRole } = render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );

    const addButton = getByRole('button', { name: /add event/i });
    addButton.click();

    await waitFor(() => {
      expect(getByText('1')).toBeInTheDocument();
      expect(getByText('1')).toBeInTheDocument();
      expect(getByText('Test Event')).toBeInTheDocument();
    });
  });
});