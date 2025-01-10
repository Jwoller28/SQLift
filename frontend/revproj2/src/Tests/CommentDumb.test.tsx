import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CommentDumb from '../CommentDumb';

describe('CommentDumb', () => {
    const mockSetMessage = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockFormRef = { current: null };

    const defaultProps = {
        setMessage: mockSetMessage,
        onSubmit: mockOnSubmit,
        formRef: mockFormRef,
    };

    it('should render the form', () => {
        const { getByLabelText, getByText } = render(<CommentDumb {...defaultProps} />);

        expect(getByLabelText('Write your thoughts:')).toBeInTheDocument();
        expect(getByText('Send')).toBeInTheDocument();
    });

    it('should handle form submission', () => {
        const { getByText } = render(<CommentDumb {...defaultProps} />);

        fireEvent.click(getByText('Send'));

        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should handle input change for message', () => {
        const { getByLabelText } = render(<CommentDumb {...defaultProps} />);

        fireEvent.change(getByLabelText('Write your thoughts:'), { target: { value: 'Test message' } });

        expect(mockSetMessage).toHaveBeenCalledWith('Test message');
    });
});