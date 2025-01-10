import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PostFeedDumb from '../PostFeedDumb';

describe('PostFeedDumb', () => {
    const mockSetMessage = jest.fn();
    const mockSetTags = jest.fn();
    const mockSetFile = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockFormRef = { current: null };

    const defaultProps = {
        setMessage: mockSetMessage,
        setTags: mockSetTags,
        onSubmit: mockOnSubmit,
        setFile: mockSetFile,
        formRef: mockFormRef,
    };

    it('should render the form', () => {
        const { getByLabelText, getByText } = render(<PostFeedDumb {...defaultProps} />);

        expect(getByLabelText('Message')).toBeInTheDocument();
        expect(getByLabelText('Tags')).toBeInTheDocument();
        expect(getByLabelText('PNG Images Only')).toBeInTheDocument();
        expect(getByText('Post to Feed')).toBeInTheDocument();
    });

    it('should handle form submission', () => {
        const { getByText } = render(<PostFeedDumb {...defaultProps} />);

        fireEvent.click(getByText('Post to Feed'));

        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should handle input changes for message', () => {
        const { getByLabelText } = render(<PostFeedDumb {...defaultProps} />);

        fireEvent.change(getByLabelText('Message'), { target: { value: 'Test message' } });

        expect(mockSetMessage).toHaveBeenCalledWith('Test message');
    });

    it('should handle input changes for tags', () => {
        const { getByLabelText } = render(<PostFeedDumb {...defaultProps} />);

        fireEvent.change(getByLabelText('Tags'), { target: { value: 'tag1 tag2' } });

        expect(mockSetTags).toHaveBeenCalledWith('tag1 tag2');
    });

    it('should handle input changes for file', () => {
        const { getByLabelText } = render(<PostFeedDumb {...defaultProps} />);

        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
        fireEvent.change(getByLabelText('PNG Images Only'), { target: { files: [file] } });

        expect(mockSetFile).toHaveBeenCalledWith(file);
    });
});