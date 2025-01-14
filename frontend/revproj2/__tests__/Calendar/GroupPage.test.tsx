import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {jest, test, beforeEach, describe, expect, } from '@jest/globals';
import GroupPage from '../../src/Calendar/GroupPage';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../../src/Components/GroupContext/GroupContext';

jest.mock('react-router-dom', () => {
    const actualRouterDom = jest.requireActual('react-router-dom');
    return {
      actualRouterDom,
      useNavigate: jest.fn(),
    };
  });


jest.mock('../../src/Components/GroupContext/GroupContext', () => ({
  useGroups: jest.fn(),
}));

describe('GroupPage', () => {
  const mockNavigate = useNavigate as jest.Mock<any>;
  const mockUseGroups = useGroups as jest.Mock<any>;

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseGroups.mockReturnValue({
      groups: [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' },
      ],
      myGroups: [1],
      createGroup: jest.fn(), // Ensure createGroup is mocked correctly
      joinGroup: jest.fn(),
      leaveGroup: jest.fn(),
      fetchGroups: jest.fn(),
    });
  });
  

  test('renders group page', () => {
    render(<GroupPage />);
    expect(screen.getByText(/Groups/i));
    expect(screen.getByText(/Create Group:/i));
    expect(screen.getByText(/Search:/i));
  });

  test('creates a group', async () => {
    const { createGroup } = mockUseGroups();  // Get the mocked createGroup directly here
    render(<GroupPage />);
  
    // Change the input value to simulate user input
    fireEvent.change(screen.getByLabelText(/Create Group:/i), { target: { value: 'New Group' } });
  
    // Find the form and simulate form submission (submit the form, not just the button click)
    const form = screen.getByRole('form')  // Get the form element
    fireEvent.submit(form);  // Simulate submitting the form
  
    // Wait for the mock function to be called with the expected argument
    await waitFor(() => {
      expect(createGroup).toHaveBeenCalledWith('New Group');
    });
  });
  
  

  test('searches for groups', () => {
    render(<GroupPage />);

    fireEvent.change(screen.getByLabelText(/Search:/i), { target: { value: 'Group 1' } });

    expect(screen.getByText(/Group 1/i));
    expect(!screen.queryByText(/Group 2/i));
  });

  test('joins a group', async () => {
    const mockJoinGroup = (mockUseGroups() as ReturnType<typeof useGroups>).joinGroup;
    render(<GroupPage />);

    fireEvent.click(screen.getByText(/Join/i));

    await waitFor(() => {
      expect(mockJoinGroup).toHaveBeenCalledWith(2);
    });
  });

  test('leaves a group', async () => {
    const mockLeaveGroup = (mockUseGroups() as ReturnType<typeof useGroups>).leaveGroup;
    render(<GroupPage />);

    fireEvent.click(screen.getByText(/Leave/i));

    await waitFor(() => {
      expect(mockLeaveGroup).toHaveBeenCalledWith(1);
    });
  });
});