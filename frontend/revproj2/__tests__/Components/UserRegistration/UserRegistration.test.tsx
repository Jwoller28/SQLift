import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import UserRegistration from '../../../src/Components/UserRegistration/UserRegistration';
/**
 * @jest-environment jsdom
 */

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('UserRegistration', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly and handles registration', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue('mock-token'),
      });

    render(
      <MemoryRouter>
        <UserRegistration />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Photo URL:'), { target: { value: 'http://example.com/photo.jpg' } });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/register', expect.any(Object));
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/goals');
    });

    expect(localStorage.getItem('token')).toBe(JSON.stringify('mock-token'));
    expect(localStorage.getItem('id')).toBe(JSON.stringify(1));
  });

  it('displays error message on registration failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    render(
      <MemoryRouter>
        <UserRegistration />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Error Registering User! Error Code: 400')).toBeInTheDocument();
    });
  });

  it('displays error message on login failure after registration', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1 }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

    render(
      <MemoryRouter>
        <UserRegistration />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Failed to Log user in after registering with error code: 401')).toBeInTheDocument();
    });
  });
});