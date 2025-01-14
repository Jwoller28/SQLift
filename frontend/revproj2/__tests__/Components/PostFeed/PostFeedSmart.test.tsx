import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostFeedSmart from '../../../src/Components/PostFeed/PostFeedSmart';
import { sendPost, usernameifAuthorized } from '../../../src/API/Axios';
/**
 * @jest-environment jsdom
 */

jest.mock('../../../src/API/Axios', () => ({
    sendPost: jest.fn(),
    usernameifAuthorized: jest.fn(),
}));

describe('PostFeedSmart Component', () => {
    const mockGoalId = 1;
    const mockUserId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        const { getByLabelText } = render(
            <PostFeedSmart goalId={mockGoalId} userId={mockUserId} />
        );
        expect(getByLabelText('Message')).toBeInTheDocument();
        expect(getByLabelText('Tags')).toBeInTheDocument();
        expect(getByLabelText('PNG Images Only')).toBeInTheDocument();
    });

    it('should update state on input change', () => {
        const { getByLabelText } = render(
            <PostFeedSmart goalId={mockGoalId} userId={mockUserId} />
        );

        const messageInput = getByLabelText('Message');
        fireEvent.change(messageInput, { target: { value: 'test message' } });
        expect((messageInput as HTMLInputElement).value).toBe('test message');

        const tagsInput = getByLabelText('Tags');
        fireEvent.change(tagsInput, { target: { value: 'test tags' } });
        expect((messageInput as HTMLInputElement).value).toBe('test tags');

        const fileInput = getByLabelText('PNG Images Only');
        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });
        expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
    });

    it('should call handleSubmit on form submit', async () => {
        (usernameifAuthorized as jest.Mock).mockResolvedValue('testuser');
        (sendPost as jest.Mock).mockResolvedValue({});

        const { getByText, getByLabelText } = render(
            <PostFeedSmart goalId={mockGoalId} userId={mockUserId} />
        );

        const messageInput = getByLabelText('Message');
        fireEvent.change(messageInput, { target: { value: 'test message' } });

        const tagsInput = getByLabelText('Tags');
        fireEvent.change(tagsInput, { target: { value: 'test tags' } });

        const fileInput = getByLabelText('PNG Images Only');
        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitButton = getByText('Post to Feed');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(usernameifAuthorized).toHaveBeenCalled();
            expect(sendPost).toHaveBeenCalled();
        });
    });
});