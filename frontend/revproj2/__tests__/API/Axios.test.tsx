import axios from 'axios';
import {
  sendPost,
  getStoredPosts,
  getPostPhoto,
  sendPostPhoto,
  getPost,
  usernameifAuthorized,
  getTrackers,
  getUserByUsername,
  getGoalbyUserId,
  getGoalsbyUserId,
  getCommentsByPost,
  sendComment,
  sendTypeFilter,
  getFilteredPost,
  getFilteredStoredPosts,
} from '../../src/API/Axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Axios API functions', () => {
  beforeEach(() => {
    localStorage.setItem('token', JSON.stringify('mock-token'));
    mockedAxios.post.mockClear();
    mockedAxios.get.mockClear();
  });

  it('sendPost sends a post request', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    const formData = new FormData();
    await sendPost(formData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/posts',
      formData,
      expect.any(Object)
    );
  });

  it('getStoredPosts retrieves stored posts', async () => {
    const mockData = [{ id: 1, content: 'test post' }];
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getStoredPosts();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/posts',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getPostPhoto retrieves a post photo', async () => {
    const mockData = 'photo-data';
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getPostPhoto('test-photo.jpg');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/s3bucket/trackr-photo-store/download/test-photo.jpg',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('sendPostPhoto sends a post photo', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    const formData = new FormData();
    await sendPostPhoto(formData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/s3bucket/trackr-photo-store/upload',
      formData,
      expect.any(Object)
    );
  });

  it('getPost retrieves a post', async () => {
    const mockData = { id: 1, content: 'test post' };
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getPost();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/live/posts',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('usernameifAuthorized retrieves the username if authorized', async () => {
    const mockData = 'testuser';
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await usernameifAuthorized();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/me',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getTrackers retrieves trackers', async () => {
    const mockData = [{ id: 1, goalId: 1 }];
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getTrackers(1, 1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/Tracker/1/1',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getUserByUsername retrieves user by username', async () => {
    const mockData = { id: 1, username: 'testuser' };
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getUserByUsername('testuser');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/username/testuser',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getGoalbyUserId retrieves goal by user ID', async () => {
    const mockData = { id: 1, userId: 1 };
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getGoalbyUserId(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/goalUser/1',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getGoalsbyUserId retrieves goals by user ID', async () => {
    const mockData = [{ id: 1, userId: 1 }];
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getGoalsbyUserId(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/goalsUser/1',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getCommentsByPost retrieves comments by post ID', async () => {
    const mockData = [{ id: 1, postId: 1 }];
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getCommentsByPost(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/fetch/comment/1',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('sendComment sends a comment', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    const formData = new FormData();
    await sendComment(formData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/create/comment',
      formData,
      expect.any(Object)
    );
  });

  it('sendTypeFilter sends a type filter', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    const searchType = { type: 'username', value: 'testuser' };
    await sendTypeFilter(searchType);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/filter',
      searchType,
      expect.any(Object)
    );
  });

  it('getFilteredPost retrieves filtered post', async () => {
    const mockData = { id: 1, content: 'filtered post' };
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getFilteredPost();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/filter/live/post',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getFilteredStoredPosts retrieves filtered stored posts', async () => {
    const mockData = [{ id: 1, content: 'filtered stored post' }];
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await getFilteredStoredPosts();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/filter/posts',
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });
});