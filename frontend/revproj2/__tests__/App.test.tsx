import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../src/App';
import UserManagement from '../src/Components/UserLogin/UserManagement';
import UserRegistration from '../src/Components/UserRegistration/UserRegistration';
import Logout from '../src/Components/Logout/Logout';
import ResetGoals from '../src/Components/SetUserGoals/ResetGoals';
import SetUserGoals from '../src/Components/SetUserGoals/SetUserGoals';
import MakeNewGoal from '../src/Components/SetUserGoals/MakeNewGoal';
import CreateEventPage from '../src/Calendar/CreateEventPage';
import CalendarPage from '../src/Calendar/CalendarPage';
import GroupPage from '../src/Calendar/GroupPage';
import DayView from '../src/Calendar/DayView';
import InputPage from '../src/Calendar/InputPage';
import ProgressPage from '../src/Calendar/ProgressPage';
import PostList from '../src/Components/PostFeed/PostList';
import Inbox from '../src/Components/Inbox/Inbox';
import UserProfile from '../src/Components/UserProfile/UserProfile';
import NavBar from '../src/Components/NavBar/NavBar';
import RouteGuard from '../src/Components/RouteGuard/RouteGuard';
/**
 * @jest-environment jsdom
 */

// Mock the RouteGuard component
jest.mock('../src/Components/RouteGuard/RouteGuard', () => {
  return {
    __esModule: true,  // Mock for ES Modules
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('App', () => {
  it('renders the login page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('LoginLandingPage')).toBeInTheDocument();
  });

  it('renders the registration page', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders the logout page', () => {
    render(
      <MemoryRouter initialEntries={['/logout']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('LoginLandingPage')).toBeInTheDocument();
  });

  it('renders the reset goals page', () => {
    render(
      <MemoryRouter initialEntries={['/resetGoals']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Reset or Update Goal')).toBeInTheDocument();
  });

  it('renders the set user goals page', () => {
    render(
      <MemoryRouter initialEntries={['/goals']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Set User Goals')).toBeInTheDocument();
  });

  it('renders the make new goal page', () => {
    render(
      <MemoryRouter initialEntries={['/newGoal']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('YOUVE COMPLETED YOUR GOAL')).toBeInTheDocument();
  });

  it('renders the create event page', () => {
    render(
      <MemoryRouter initialEntries={['/createEvent/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('renders the calendar page', () => {
    render(
      <MemoryRouter initialEntries={['/calendar']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('renders the group page', () => {
    render(
      <MemoryRouter initialEntries={['/groups']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('renders the day view page', () => {
    render(
      <MemoryRouter initialEntries={['/day/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Day View')).toBeInTheDocument();
  });

  it('renders the week view page', () => {
    render(
      <MemoryRouter initialEntries={['/Week']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Week View')).toBeInTheDocument();
  });

  it('renders the input page', () => {
    render(
      <MemoryRouter initialEntries={['/input/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Input Page')).toBeInTheDocument();
  });

  it('renders the progress page', () => {
    render(
      <MemoryRouter initialEntries={['/progress/1']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Progress Page')).toBeInTheDocument();
  });

  it('renders the feed page', () => {
    render(
      <MemoryRouter initialEntries={['/feed']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Feed')).toBeInTheDocument();
  });

  it('renders the inbox page', () => {
    render(
      <MemoryRouter initialEntries={['/inbox']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  it('renders the profile page', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
  });
});