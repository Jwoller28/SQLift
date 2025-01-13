import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Logout from '../../../src/Components/Logout/Logout';
import { useNavigate } from 'react-router-dom';

/**
 * @jest-environment jsdom
 */

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Logout Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  it('should remove token from localStorage on mount', () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should navigate to login page', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Assuming the component redirects to the login page, 
      // check if navigate was called with the correct path.
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
