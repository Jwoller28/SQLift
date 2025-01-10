import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import PostList from '../PostList';
import { getStoredPosts, getPost, getFilteredPost, getFilteredStoredPosts } from '../../../API/Axios';

jest.mock('../../../API/Axios');
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
}));

describe('PostList', () => {
    const mockGetStoredPosts = getStoredPosts as jest.Mock;
    const mockGetPost = getPost as jest.Mock;
    const mockGetFilteredPost = getFilteredPost as jest.Mock;
    const mockGetFilteredStoredPosts = getFilteredStoredPosts as jest.Mock;
    const mockUseLocation = useLocation as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseLocation.mockReturnValue({ pathname: '/feed' });
    });

    it('should fetch initial posts', async () => {
        const posts = [{ postId: 1, goal: { id: 1 }, user: { id: 1, username: 'testuser' }, messageText: 'Test post', creation: '2023-01-01', tags: ['tag1'], photo: 'photo.jpg' }];
        mockGetStoredPosts.mockResolvedValue(posts);

        const { getByText } = render(<PostList />);

        await waitFor(() => {
            expect(mockGetStoredPosts).toHaveBeenCalled();
            expect(getByText('Goal ID: 1')).toBeInTheDocument();
            expect(getByText('Username: testuser')).toBeInTheDocument();
            expect(getByText('Message Text: Test post')).toBeInTheDocument();
        });
    });

    it('should poll for new posts', async () => {
        const newPost = { postId: 2, goal: { id: 2 }, user: { id: 2, username: 'newuser' }, messageText: 'New post', creation: '2023-01-02', tags: ['tag2'], photo: 'newphoto.jpg' };
        mockGetPost.mockResolvedValue(newPost);

        const { getByText } = render(<PostList />);

        await waitFor(() => {
            expect(mockGetPost).toHaveBeenCalled();
            expect(getByText('Goal ID: 2')).toBeInTheDocument();
            expect(getByText('Username: newuser')).toBeInTheDocument();
            expect(getByText('Message Text: New post')).toBeInTheDocument();
        });
    });

    it('should fetch filtered posts', async () => {
        const filteredPosts = [{ postId: 3, goal: { id: 3 }, user: { id: 3, username: 'filtereduser' }, messageText: 'Filtered post', creation: '2023-01-03', tags: ['tag3'], photo: 'filteredphoto.jpg' }];
        mockGetFilteredStoredPosts.mockResolvedValue(filteredPosts);

        const { getByText } = render(<PostList />);

        await waitFor(() => {
            expect(mockGetFilteredStoredPosts).toHaveBeenCalled();
            expect(getByText('Goal ID: 3')).toBeInTheDocument();
            expect(getByText('Username: filtereduser')).toBeInTheDocument();
            expect(getByText('Message Text: Filtered post')).toBeInTheDocument();
        });
    });

    it('should toggle comments', async () => {
        const posts = [{ postId: 1, goal: { id: 1 }, user: { id: 1, username: 'testuser' }, messageText: 'Test post', creation: '2023-01-01', tags: ['tag1'], photo: 'photo.jpg' }];
        mockGetStoredPosts.mockResolvedValue(posts);

        const { getByText } = render(<PostList />);

        await waitFor(() => {
            expect(mockGetStoredPosts).toHaveBeenCalled();
        });

        fireEvent.click(getByText('Comment'));

        await waitFor(() => {
            expect(getByText('Comments')).toBeInTheDocument();
        });
    });
});