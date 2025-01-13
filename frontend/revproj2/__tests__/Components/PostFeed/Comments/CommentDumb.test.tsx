import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentDumb from '../../../../src/Components/PostFeed/Comments/CommentDumb';
/**
 * @jest-environment jsdom
 */

describe('CommentDumb Component', () => {
	const mockSetMessage = jest.fn();
	const mockOnSubmit = jest.fn((e) => e.preventDefault());
	const mockFormRef = { current: null };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render without crashing', () => {
		const { getByLabelText } = render(
			<CommentDumb
				setMessage={mockSetMessage}
				onSubmit={mockOnSubmit}
				formRef={mockFormRef}
			/>
		);
		expect(getByLabelText(/Write your thoughts:/i)).toBeInTheDocument();
	});

	it('should call setMessage on input change', () => {
		const { getByLabelText } = render(
			<CommentDumb
				setMessage={mockSetMessage}
				onSubmit={mockOnSubmit}
				formRef={mockFormRef}
			/>
		);
		const messageInput = getByLabelText('Write your thoughts:');
		fireEvent.change(messageInput, { target: { value: 'test message' } });
		expect(mockSetMessage).toHaveBeenCalledWith('test message');
	});

	it('should call onSubmit on form submit', () => {
		const { getByText } = render(
			<CommentDumb
				setMessage={mockSetMessage}
				onSubmit={mockOnSubmit}
				formRef={mockFormRef}
			/>
		);
		const submitButton = getByText('Send');
		fireEvent.click(submitButton);
		expect(mockOnSubmit).toHaveBeenCalled();
	});
});