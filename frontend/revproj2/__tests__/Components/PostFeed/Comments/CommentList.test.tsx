import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentList from '../../../../src/Components/PostFeed/Comments/CommentList';
import { sendComment, getCommentsByPost } from '../../../../src/API/Axios';
/**
 * @jest-environment jsdom
 */

jest.mock('../../../../src/API/Axios', () => ({
  sendComment: jest.fn(),
  getCommentsByPost: jest.fn(),
}));

describe('CommentList Component', () => {
  const mockPost = {
    postId: 1,
    user: { id: 1, username: 'testuser' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<CommentList post={mockPost} />);
    expect(getByText('Loading post...')).toBeInTheDocument();
  });

  it('should fetch comments on mount', async () => {
    const mockComments = [
      {
        user: { username: 'commentuser' },
        timestamp: '2023-10-10',
        text: 'Test comment',
      },
    ];
    (getCommentsByPost as jest.Mock).mockResolvedValue(mockComments);

    const { getByText } = render(<CommentList post={mockPost} />);

    await waitFor(() => {
      expect(getCommentsByPost).toHaveBeenCalledWith(mockPost.postId);
      expect(getByText('Test comment')).toBeInTheDocument();
    });
  });

  it('should handle comment submission', async () => {
    (sendComment as jest.Mock).mockResolvedValue({});
    (getCommentsByPost as jest.Mock).mockResolvedValue([]);

    const { getByLabelText, getByText } = render(<CommentList post={mockPost} />);

    const messageInput = getByLabelText('Write your thoughts:');
    fireEvent.change(messageInput, { target: { value: 'New comment' } });

    const submitButton = getByText('Send');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendComment).toHaveBeenCalled();
      expect(getCommentsByPost).toHaveBeenCalledWith(mockPost.postId);
    });
  });

  it('should display error message on comment fetch failure', async () => {
    (getCommentsByPost as jest.Mock).mockRejectedValue(new Error('Failed to load comments'));

    const { getByText } = render(<CommentList post={mockPost} />);

    await waitFor(() => {
      expect(getByText('Failed to load comments')).toBeInTheDocument();
    });
  });

  it('should display error message on comment submission failure', async () => {
    (sendComment as jest.Mock).mockRejectedValue(new Error('Failed to submit comment'));
    (getCommentsByPost as jest.Mock).mockResolvedValue([]);

    const { getByLabelText, getByText } = render(<CommentList post={mockPost} />);

    const messageInput = getByLabelText('Write your thoughts:');
    fireEvent.change(messageInput, { target: { value: 'New comment' } });

    const submitButton = getByText('Send');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendComment).toHaveBeenCalled();
      expect(getByText('Failed to submit comment')).toBeInTheDocument();
    });
  });
});