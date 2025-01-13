import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RouteGuard from '../../../src/Components/RouteGuard/RouteGuard';
/**
 * @jest-environment jsdom
 */

describe('RouteGuard Component', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should navigate to login if token is not present', () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={['/protected']}>
				<Routes>
					<Route path="/login" element={<div>Login Page</div>} />
					<Route path="/protected" element={<RouteGuard><div>Protected Content</div></RouteGuard>} />
				</Routes>
			</MemoryRouter>
		);

		expect(getByText('Login Page')).toBeInTheDocument();
	});

	it('should navigate to login if token is invalid', () => {
		localStorage.setItem('token', JSON.stringify(''));

		const { getByText } = render(
			<MemoryRouter initialEntries={['/protected']}>
				<Routes>
					<Route path="/login" element={<div>Login Page</div>} />
					<Route path="/protected" element={<RouteGuard><div>Protected Content</div></RouteGuard>} />
				</Routes>
			</MemoryRouter>
		);

		expect(getByText('Login Page')).toBeInTheDocument();
	});

	it('should render children if token is valid', () => {
		localStorage.setItem('token', JSON.stringify('valid-token'));

		const { getByText } = render(
			<MemoryRouter initialEntries={['/protected']}>
				<Routes>
					<Route path="/login" element={<div>Login Page</div>} />
					<Route path="/protected" element={<RouteGuard><div>Protected Content</div></RouteGuard>} />
				</Routes>
			</MemoryRouter>
		);

		expect(getByText('Protected Content')).toBeInTheDocument();
	});
});