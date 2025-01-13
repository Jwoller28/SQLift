import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GroupProvider, useGroups } from '../../../src/Components/GroupContext/GroupContext';
/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

describe('GroupContext', () => {
  const TestComponent = () => {
    const { groups, myGroups, fetchGroups, createGroup, joinGroup, leaveGroup, fetchGroupEvents, createGroupEvent, getAllGroupEventsForDay } = useGroups();
    return (
      <div>
        <button onClick={fetchGroups}>Fetch Groups</button>
        <button onClick={() => createGroup('Test Group')}>Create Group</button>
        <button onClick={() => joinGroup(1)}>Join Group</button>
        <button onClick={() => leaveGroup(1)}>Leave Group</button>
        <button onClick={() => fetchGroupEvents(1)}>Fetch Group Events</button>
        <button onClick={() => createGroupEvent(1, '2023-10-10', 'Test Event', 'Description')}>Create Group Event</button>
        <button onClick={() => getAllGroupEventsForDay('2023-10-10', 1)}>Get All Group Events For Day</button>
        <div>{groups.length}</div>
        <div>{myGroups.length}</div>
      </div>
    );
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should provide group context', () => {
    const { getByText } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    expect(getByText('0')).toBeInTheDocument();
  });

  it('should fetch groups', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Group 1', isMember: true }],
    });

    const { getByText, getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const fetchButton = getByRole('button', { name: /fetch groups/i });
    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(getByText('1')).toBeInTheDocument();
    });
  });

  it('should create a group', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Group 1', isMember: true }],
    });

    const { getByText, getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const createButton = getByRole('button', { name: /create group/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(getByText('1')).toBeInTheDocument();
    });
  });

  it('should join a group', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { getByText, getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const joinButton = getByRole('button', { name: /join group/i });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(getByText('1')).toBeInTheDocument();
    });
  });

  it('should leave a group', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { getByText, getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const leaveButton = getByRole('button', { name: /leave group/i });
    fireEvent.click(leaveButton);

    await waitFor(() => {
      expect(getByText('0')).toBeInTheDocument();
    });
  });

  it('should fetch group events', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, day: '2023-10-10', title: 'Event 1', description: 'Description' }],
    });

    const { getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const fetchEventsButton = getByRole('button', { name: /fetch group events/i });
    fireEvent.click(fetchEventsButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should create a group event', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const createEventButton = getByRole('button', { name: /create group event/i });
    fireEvent.click(createEventButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should get all group events for a day', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, day: '2023-10-10', title: 'Event 1', description: 'Description' }],
    });

    const { getByRole } = render(
      <GroupProvider>
        <TestComponent />
      </GroupProvider>
    );

    const getAllEventsButton = getByRole('button', { name: /get all group events for day/i });
    fireEvent.click(getAllEventsButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});