import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PostFeedSmart from '../PostFeedSmart';
import { sendPost, usernameifAuthorized } from '../../../API/Axios';

jest.mock('../../../API/Axios');

describe('PostFeedSmart', () => {
    const mockSendPost = sendPost as jest.Mock;
    const mockUsernameifAuthorized = usernameifAuthorized as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should submit form without file', async () => {
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockSendPost.mockResolvedValue({});

        const { getByLabelText, getByText } = render(<PostFeedSmart goalId={1} userId={1} />);

        fireEvent.change(getByLabelText('Message'), { target: { value: 'Test message' } });
        fireEvent.change(getByLabelText('Tags'), { target: { value: 'tag1 tag2' } });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(mockUsernameifAuthorized).toHaveBeenCalled();
            expect(mockSendPost).toHaveBeenCalledWith(expect.any(FormData));
        });

        const formData = mockSendPost.mock.calls[0][0];
        expect(formData.get('goal_id')).toBe('1');
        expect(formData.get('user_id')).toBe('1');
        expect(formData.get('message_text')).toBe('Test message');
        expect(formData.get('message_tags')).toBe('tag1 tag2');
        expect(formData.get('username')).toBe('testuser');
        expect(formData.get('photo')).toBeNull();
    });

    it('should submit form with file', async () => {
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockSendPost.mockResolvedValue({});

        const { getByLabelText, getByText } = render(<PostFeedSmart goalId={1} userId={1} />);

        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
        fireEvent.change(getByLabelText('Message'), { target: { value: 'Test message' } });
        fireEvent.change(getByLabelText('Tags'), { target: { value: 'tag1 tag2' } });
        fireEvent.change(getByLabelText('Photo'), { target: { files: [file] } });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(mockUsernameifAuthorized).toHaveBeenCalled();
            expect(mockSendPost).toHaveBeenCalledWith(expect.any(FormData));
        });

        const formData = mockSendPost.mock.calls[0][0];
        expect(formData.get('goal_id')).toBe('1');
        expect(formData.get('user_id')).toBe('1');
        expect(formData.get('message_text')).toBe('Test message');
        expect(formData.get('message_tags')).toBe('tag1 tag2');
        expect(formData.get('username')).toBe('testuser');
        expect(formData.get('photo')).toBe(file);
    });

    it('should reset form after submission', async () => {
        mockUsernameifAuthorized.mockResolvedValue('testuser');
        mockSendPost.mockResolvedValue({});

        const { getByLabelText, getByText } = render(<PostFeedSmart goalId={1} userId={1} />);

        fireEvent.change(getByLabelText('Message'), { target: { value: 'Test message' } });
        fireEvent.change(getByLabelText('Tags'), { target: { value: 'tag1 tag2' } });

        fireEvent.click(getByText('Submit'));

        await waitFor(() => {
            expect(mockUsernameifAuthorized).toHaveBeenCalled();
            expect(mockSendPost).toHaveBeenCalledWith(expect.any(FormData));
        });

        expect(getByLabelText('Message')).toHaveValue('');
        expect(getByLabelText('Tags')).toHaveValue('');
        expect(getByLabelText('Photo')).toHaveValue('');
    });
});