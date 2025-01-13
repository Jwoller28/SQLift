import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LoginLandingPage from '../../../src/Components/UserLogin/LoginLandingPage';
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

describe('LoginLandingPage', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify('mock-token'));
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly and navigates to /calendar', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue('mock-username'),
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginLandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });

    expect(screen.getByText('LoginLandingPage')).toBeInTheDocument();
  });

  it('fetches user token and logs it', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue('mock-username'),
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginLandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/me', expect.any(Object));
    });

    expect(screen.getByText('LoginLandingPage')).toBeInTheDocument();
  });

  it('throws error if used outside of AuthProvider', () => {
    console.error = jest.fn(); // Suppress error output in test

    expect(() => {
      render(
        <MemoryRouter>
          <LoginLandingPage />
        </MemoryRouter>
      );
    }).toThrow('Login must be used within an AuthProvider');
  });
});