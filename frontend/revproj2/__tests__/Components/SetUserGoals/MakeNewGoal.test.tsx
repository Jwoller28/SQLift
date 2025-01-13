import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import MakeNewGoal from '../../../src/Components/SetUserGoals/MakeNewGoal';
/**
 * @jest-environment jsdom
 */

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('MakeNewGoal', () => {
  it('renders correctly, and handles button clicks', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <MakeNewGoal />
      </MemoryRouter>
    );

    // Check if the text is rendered
    expect(screen.getByText('YOUVE COMPLETED YOUR GOAL')).toBeInTheDocument();
    expect(screen.getByText('Would you like to edit your current goal and extend the duration, or would you like to create a new goal and start over?')).toBeInTheDocument();

    // Check if the buttons are rendered
    const createNewButton = screen.getByText('Create new goal');
    const editCurrentButton = screen.getByText('Edit current goal');
    expect(createNewButton).toBeInTheDocument();
    expect(editCurrentButton).toBeInTheDocument();

    // Simulate button clicks
    fireEvent.click(createNewButton);
    expect(navigate).toHaveBeenCalledWith('/goals');

    fireEvent.click(editCurrentButton);
    expect(navigate).toHaveBeenCalledWith('/resetGoals');
  });
});