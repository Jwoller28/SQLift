import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import UserManagement from '.,/../../src/Components/UserLogin/UserManagement';
import { AuthProvider } from '../../../src/Components/UserContext/UserContext';
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

describe('UserManagement', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly and handles login', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue('mock-token'),
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <UserManagement />
        </AuthProvider>
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });

    // Simulate form submission
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });

    expect(localStorage.getItem('token')).toBe(JSON.stringify('mock-token'));
  });

  it('throws error if used outside of AuthProvider', () => {
    console.error = jest.fn(); // Suppress error output in test

    expect(() => {
      render(
        <MemoryRouter>
          <UserManagement />
        </MemoryRouter>
      );
    }).toThrow('Login must be used within an AuthProvider');
  });
});