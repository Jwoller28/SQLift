import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../../../src/Components/NavBar/NavBar';
import { MemoryRouter } from 'react-router-dom';
/**
 * @jest-environment jsdom
 */

describe('NavBar Component', () => {
    it('should render without crashing', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        expect(getByText('Trackr')).toBeInTheDocument();
    });

    it('should have a link to the calendar', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const calendarLink = getByText('Calendar');
        expect(calendarLink).toBeInTheDocument();
        expect(calendarLink.closest('a')).toHaveAttribute('href', '/calendar');
    });

    it('should have a link to the profile', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const profileLink = getByText('Profile');
        expect(profileLink).toBeInTheDocument();
        expect(profileLink.closest('a')).toHaveAttribute('href', '/profile');
    });

    it('should have a link to the feed', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const feedLink = getByText('Feed');
        expect(feedLink).toBeInTheDocument();
        expect(feedLink.closest('a')).toHaveAttribute('href', '/feed');
    });

    it('should have a link to the inbox', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const inboxLink = getByText('Inbox');
        expect(inboxLink).toBeInTheDocument();
        expect(inboxLink.closest('a')).toHaveAttribute('href', '/inbox');
    });

    it('should have a link to the goals', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const goalsLink = getByText('Goals');
        expect(goalsLink).toBeInTheDocument();
        expect(goalsLink.closest('a')).toHaveAttribute('href', '/resetGoals');
    });

    it('should have a link to the groups', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const groupsLink = getByText('Groups');
        expect(groupsLink).toBeInTheDocument();
        expect(groupsLink.closest('a')).toHaveAttribute('href', '/groups');
    });

    it('should have a link to logout', () => {
        const { getByText } = render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        const logoutLink = getByText('Logout');
        expect(logoutLink).toBeInTheDocument();
        expect(logoutLink.closest('a')).toHaveAttribute('href', '/logout');
    });
});