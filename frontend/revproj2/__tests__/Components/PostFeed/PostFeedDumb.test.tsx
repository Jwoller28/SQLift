import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostFeedDumb from '../../../src/Components/PostFeed/PostFeedDumb';
/**
 * @jest-environment jsdom
 */

describe('PostFeedDumb Component', () => {
  const mockSetMessage = jest.fn();
  const mockSetTags = jest.fn();
  const mockOnSubmit = jest.fn((e) => e.preventDefault());
  const mockSetFile = jest.fn();
  const mockFormRef = { current: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByLabelText } = render(
      <PostFeedDumb
        setMessage={mockSetMessage}
        setTags={mockSetTags}
        onSubmit={mockOnSubmit}
        setFile={mockSetFile}
        formRef={mockFormRef}
      />
    );
    expect(getByLabelText('Message')).toBeInTheDocument();
    expect(getByLabelText('Tags')).toBeInTheDocument();
    expect(getByLabelText('PNG Images Only')).toBeInTheDocument();
  });

  it('should call setMessage on message input change', () => {
    const { getByLabelText } = render(
      <PostFeedDumb
        setMessage={mockSetMessage}
        setTags={mockSetTags}
        onSubmit={mockOnSubmit}
        setFile={mockSetFile}
        formRef={mockFormRef}
      />
    );
    const messageInput = getByLabelText('Message');
    fireEvent.change(messageInput, { target: { value: 'test message' } });
    expect(mockSetMessage).toHaveBeenCalledWith('test message');
  });

  it('should call setTags on tags input change', () => {
    const { getByLabelText } = render(
      <PostFeedDumb
        setMessage={mockSetMessage}
        setTags={mockSetTags}
        onSubmit={mockOnSubmit}
        setFile={mockSetFile}
        formRef={mockFormRef}
      />
    );
    const tagsInput = getByLabelText('Tags');
    fireEvent.change(tagsInput, { target: { value: 'test tags' } });
    expect(mockSetTags).toHaveBeenCalledWith('test tags');
  });

  it('should call setFile on file input change', () => {
    const { getByLabelText } = render(
      <PostFeedDumb
        setMessage={mockSetMessage}
        setTags={mockSetTags}
        onSubmit={mockOnSubmit}
        setFile={mockSetFile}
        formRef={mockFormRef}
      />
    );
    const fileInput = getByLabelText('PNG Images Only');
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockSetFile).toHaveBeenCalledWith(file);
  });

  it('should call onSubmit on form submit', () => {
    const { getByText } = render(
      <PostFeedDumb
        setMessage={mockSetMessage}
        setTags={mockSetTags}
        onSubmit={mockOnSubmit}
        setFile={mockSetFile}
        formRef={mockFormRef}
      />
    );
    const submitButton = getByText('Post to Feed');
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});