import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FeedSearch, { searchType } from '../FeedSearch';
import { sendTypeFilter } from '../../../API/Axios';

jest.mock('../../../API/Axios');

describe('FeedSearch', () => {
    const mockSendTypeFilter = sendTypeFilter as jest.Mock;
    const mockOnChange = jest.fn();
    const mockSetSearched = jest.fn();

    const defaultProps = {
        onChange: mockOnChange,
        setSearched: mockSetSearched,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle search input change', () => {
        const { getByLabelText } = render(<FeedSearch {...defaultProps} />);

        fireEvent.change(getByLabelText('Search the Feed:'), { target: { value: 'test query' } });

        expect(mockOnChange).toHaveBeenCalledWith('test query');
    });

    it('should handle search submission', async () => {
        const { getByText, getByLabelText } = render(<FeedSearch {...defaultProps} />);

        fireEvent.change(getByLabelText('Search the Feed:'), { target: { value: 'test query' } });
        fireEvent.change(document.querySelector('#typeInput') as HTMLSelectElement, { target: { value: 'username' } });

        fireEvent.click(getByText('Search'));

        await waitFor(() => {
            expect(mockSetSearched).toHaveBeenCalledWith(expect.any(Function));
            expect(mockSendTypeFilter).toHaveBeenCalledWith({ type: 'username', value: 'test query' });
        });
    });

    it('should handle clearing the search', () => {
        const { getByText, getByLabelText } = render(<FeedSearch {...defaultProps} />);

        fireEvent.change(getByLabelText('Search the Feed:'), { target: { value: 'test query' } });
        fireEvent.click(getByText('Clear'));

        expect(mockOnChange).toHaveBeenCalledWith('');
        expect(mockSetSearched).toHaveBeenCalledWith(false);
        expect(getByLabelText('Search the Feed:')).toHaveValue('');
        expect((document.querySelector('#typeInput') as HTMLSelectElement).selectedIndex).toBe(-1);
    });
});