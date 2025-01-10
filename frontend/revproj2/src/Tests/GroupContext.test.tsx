import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GroupProvider, useGroups } from '../GroupContext';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('GroupContext', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', JSON.stringify('mockToken'));
        localStorage.setItem('id', JSON.stringify(1));
    });

    const TestComponent = () => {
        const context = useGroups();
        return (
            <div>
                <button onClick={context.fetchGroups}>Fetch Groups</button>
                <button onClick={() => context.createGroup('Test Group')}>Create Group</button>
                <button onClick={() => context.joinGroup(1)}>Join Group</button>
                <button onClick={() => context.leaveGroup(1)}>Leave Group</button>
                <button onClick={() => context.fetchGroupEvents(1)}>Fetch Group Events</button>
                <button onClick={() => context.createGroupEvent(1, '2023-01-01', 'Test Event', 'Description')}>Create Group Event</button>
                <button onClick={() => context.getAllGroupEventsForDay('2023-01-01', 1)}>Get All Group Events For Day</button>
            </div>
        );
    };

    it('should fetch groups', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Group', isMember: true }]),
        });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Fetch Groups'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups?userId=1', expect.any(Object));
        });
    });

    it('should create a group', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Create Group'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups', expect.any(Object));
        });
    });

    it('should join a group', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Join Group'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups/1/join?userId=1', expect.any(Object));
        });
    });

    it('should leave a group', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Leave Group'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups/1/leave?userId=1', expect.any(Object));
        });
    });

    it('should fetch group events', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([{ id: 1, day: '2023-01-01', title: 'Test Event', description: 'Description' }]),
        });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Fetch Group Events'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups/1/events', expect.any(Object));
        });
    });

    it('should create a group event', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Create Group Event'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups/1/events', expect.any(Object));
        });
    });

    it('should get all group events for a day', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue([{ id: 1, day: '2023-01-01', title: 'Test Event', description: 'Description' }]),
        });

        const { getByText } = render(
            <GroupProvider>
                <TestComponent />
            </GroupProvider>
        );

        fireEvent.click(getByText('Get All Group Events For Day'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/groups/1/events', expect.any(Object));
        });
    });
});