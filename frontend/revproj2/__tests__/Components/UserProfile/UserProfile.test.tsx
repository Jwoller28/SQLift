import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../../../src/Components/UserProfile/UserProfile';
/**
 * @jest-environment jsdom
 */

// Mock the fetch API
global.fetch = jest.fn();

describe('UserProfile', () => {
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
        json: jest.fn().mockResolvedValue({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          id: 1,
        }),
      });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('Username: mock-username')).toBeInTheDocument();
      expect(screen.getByText('First Name: John')).toBeInTheDocument();
      expect(screen.getByText('Last Name: Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('opens and closes the modal', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue('mock-username'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          id: 1,
        }),
      });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('Username: mock-username')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    });
  });

  it('updates the profile', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue('mock-username'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          id: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('Username: mock-username')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane.smith@example.com' } });

    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/user/1', expect.any(Object));
    });
  });
});