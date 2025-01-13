import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostList from '../../../src/Components/PostFeed/PostList';
import { getStoredPosts, getPost, getFilteredStoredPosts, sendTypeFilter} from '../../../src/API/Axios';
import { MemoryRouter } from 'react-router-dom';
/**
 * @jest-environment jsdom
 */

jest.mock('../../../src/API/Axios', () => ({
    getUserByUsername: jest.fn(),
    usernameifAuthorized: jest.fn(),
    getStoredPosts: jest.fn(),
    getFilteredStoredPosts: jest.fn(),
    getPost: jest.fn(),
    sendTypeFilter: jest.fn()
}));

describe('PostList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostList />
      </MemoryRouter>
    );
    expect(getByText(/We will get there Together!/i)).toBeInTheDocument();
  });

  it('should fetch stored posts on mount', async () => {
    const mockPosts = [
      {
        postId: 1,
        goal: { id: 1 },
        user: { id: 1, username: 'testuser' },
        messageText: 'Test message',
        creation: '2023-10-10',
        tags: ['test'],
        photo: 'test.jpg',
      },
    ];
    (getStoredPosts as jest.Mock).mockResolvedValue(mockPosts);

    const { getByText } = render(
      <MemoryRouter>
        <PostList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getStoredPosts).toHaveBeenCalled();
      expect(getByText(/Test message/i)).toBeInTheDocument();
    });
  });

  it('should poll for new posts when not in search mode', async () => {
    const mockNewPost = {
      postId: 2,
      goal: { id: 2 },
      user: { id: 2, username: 'newuser' },
      messageText: 'New post message',
      creation: '2023-10-11',
      tags: ['new'],
      photo: 'new.jpg',
    };
    (getPost as jest.Mock).mockResolvedValue(mockNewPost);

    const { getByText } = render(
      <MemoryRouter initialEntries={['/feed']}>
        <PostList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getPost).toHaveBeenCalled();
      expect(getByText(/New post message/i)).toBeInTheDocument();
    });
  });

  it('should handle search and fetch filtered posts', async () => {
    const mockFilteredPosts = [
      {
        postId: 3,
        goal: { id: 3 },
        user: { id: 3, username: 'filtereduser' },
        messageText: 'Filtered post message',
        creation: '2023-10-12',
        tags: ['filtered'],
        photo: 'filtered.jpg',
      },
    ];
    (getFilteredStoredPosts as jest.Mock).mockResolvedValue(mockFilteredPosts);

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <PostList />
      </MemoryRouter>
    );

    const searchInput = getByLabelText(/Search the Feed:/i).nextSibling as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'filtered' } });
    fireEvent.submit(searchInput);

    await waitFor(() => {
      expect(getFilteredStoredPosts).toHaveBeenCalled();
      expect(getByText(/Filtered post message/i)).toBeInTheDocument();
    });
  });

  it('should handle comment button click', async () => {
    const mockPosts = [
      {
        postId: 1,
        goal: { id: 1 },
        user: { id: 1, username: 'testuser' },
        messageText: 'Test message',
        creation: '2023-10-10',
        tags: ['test'],
        photo: 'test.jpg',
      },
    ];
    (getStoredPosts as jest.Mock).mockResolvedValue(mockPosts);

    const { getByText } = render(
      <MemoryRouter>
        <PostList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getStoredPosts).toHaveBeenCalled();
      expect(getByText(/Test message/i)).toBeInTheDocument();
    });

    const commentButton = getByText(/Comment/i);
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(screen.getByText(/Write your thoughts:/i)).toBeInTheDocument();
    });
  });
});