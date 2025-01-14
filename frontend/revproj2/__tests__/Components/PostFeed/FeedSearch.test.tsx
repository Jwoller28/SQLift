import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedSearch, { FeedSearchProps } from '../../../src/Components/PostFeed/FeedSearch';
import { sendTypeFilter } from '../../../src/API/Axios';
/**
 * @jest-environment jsdom
 */

// Mock the sendTypeFilter function
jest.mock('../../../src/API/Axios', () => ({
  sendTypeFilter: jest.fn(),
}));

describe('FeedSearch', () => {
  const mockOnSearch = jest.fn();

  const defaultProps: FeedSearchProps = {
    onSearch: mockOnSearch,
    searchQuery: '',
    searched: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FeedSearch {...defaultProps} />);

    expect(screen.getByLabelText('Search the Feed:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('handles search input change', () => {
    render(<FeedSearch {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveValue('test');
    expect(mockOnSearch).toHaveBeenCalledWith('test', false);
  });

  it('handles search type change', () => {
    render(<FeedSearch {...defaultProps} />);

    const typeSelect = screen.getByLabelText('Search the Feed:');
    fireEvent.change(typeSelect, { target: { value: 'tags' } });

    expect(typeSelect).toHaveValue('tags');
  });

  it('handles form submission', async () => {
    (sendTypeFilter as jest.Mock).mockResolvedValueOnce({});

    render(<FeedSearch {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(sendTypeFilter).toHaveBeenCalledWith({ type: 'username', value: 'test' });
      expect(mockOnSearch).toHaveBeenCalledWith('test', true);
    });
  });

  it('handles clear search', () => {
    render(<FeedSearch {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('', false);
  });
});