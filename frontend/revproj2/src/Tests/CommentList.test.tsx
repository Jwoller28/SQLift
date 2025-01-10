import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CommentList from '../CommentList';
import { sendComment, getCommentsByPost } from '../../../../API/Axios';

jest.mock('../../../../API/Axios');

describe('CommentList', () => {
    const mockSendComment = sendComment as jest.Mock;
    const mockGetCommentsByPost = getCommentsByPost as jest.Mock;

    const post = {
        postId: 1,
        user: { id: 1, username: 'testuser' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch comments on mount', async () => {
        const comments = [{ user: { username: 'commentuser' }, timestamp: '2023-01-01', text: 'Test comment' }];
        mockGetCommentsByPost.mockResolvedValue(comments);

        const { getByText } = render(<CommentList post={post} />);

        await waitFor(() => {
            expect(mockGetCommentsByPost).toHaveBeenCalledWith(1);
            expect(getByText('commentuser')).toBeInTheDocument();
            expect(getByText('Test comment')).toBeInTheDocument();
        });
    });

    it('should handle comment submission', async () => {
        const comments = [{ user: { username: 'commentuser' }, timestamp: '2023-01-01', text: 'Test comment' }];
        mockGetCommentsByPost.mockResolvedValue(comments);
        mockSendComment.mockResolvedValue({});

        const { getByLabelText, getByText } = render(<CommentList post={post} />);

        await waitFor(() => {
            expect(mockGetCommentsByPost).toHaveBeenCalledWith(1);
        });

        fireEvent.change(getByLabelText('Message'), { target: { value: 'New comment' } });
        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(mockSendComment).toHaveBeenCalledWith(expect.any(FormData));
            expect(mockGetCommentsByPost).toHaveBeenCalledWith(1);
        });

        const formData = mockSendComment.mock.calls[0][0];
        expect(formData.get('user_id')).toBe('1');
        expect(formData.get('post_id')).toBe('1');
        expect(formData.get('message_text')).toBe('New comment');
    });

    it('should handle error fetching comments', async () => {
        mockGetCommentsByPost.mockRejectedValue(new Error('Failed to load comments'));

        const { getByText } = render(<CommentList post={post} />);

        await waitFor(() => {
            expect(mockGetCommentsByPost).toHaveBeenCalledWith(1);
            expect(getByText('Failed to load comments')).toBeInTheDocument();
        });
    });

    it('should handle error submitting comment', async () => {
        const comments = [{ user: { username: 'commentuser' }, timestamp: '2023-01-01', text: 'Test comment' }];
        mockGetCommentsByPost.mockResolvedValue(comments);
        mockSendComment.mockRejectedValue(new Error('Failed to submit comment'));

        const { getByLabelText, getByText } = render(<CommentList post={post} />);

        await waitFor(() => {
            expect(mockGetCommentsByPost).toHaveBeenCalledWith(1);
        });

        fireEvent.change(getByLabelText('Message'), { target: { value: 'New comment' } });
        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(mockSendComment).toHaveBeenCalledWith(expect.any(FormData));
            expect(getByText('Failed to submit comment')).toBeInTheDocument();
        });
    });
});