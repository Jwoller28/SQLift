import axios from 'axios';
import { jest, describe, beforeEach, it, expect,  } from '@jest/globals';
import { searchType } from '../../src/Components/PostFeed/FeedSearch';
import { sendPost, getStoredPosts, getPostPhoto, sendPostPhoto, getPost, usernameifAuthorized, getTrackers, getUserByUsername, getGoalbyUserId, getGoalsbyUserId, getCommentsByPost, sendComment, sendTypeFilter, getFilteredPost, getFilteredStoredPosts } from '../../src/API/Axios';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('API Service Tests', () => {
  const mockToken = 'test-token';
  const mockCleanToken = 'test-token';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage.getItem
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => mockToken),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });

  describe('sendPost', () => {
    it('should successfully send a post', async () => {
      const mockFormData = new FormData();
      mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });

      await sendPost(mockFormData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/posts',
        mockFormData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${mockCleanToken}`,
            'Access-Control-Allow-Origin': '*'
          }),
          withCredentials: true
        })
      );
    });

    it('should handle errors when sending post fails', async () => {
      const mockFormData = new FormData();
      const mockError = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(mockError);
      
      const consoleSpy = jest.spyOn(console, 'error');
      await sendPost(mockFormData);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error sending message:', mockError);
    });
  });

  describe('getStoredPosts', () => {
    it('should successfully retrieve stored posts', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockPosts });

      const result = await getStoredPosts();

      expect(result).toEqual(mockPosts);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8080/posts',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockCleanToken}`,
            'Access-Control-Allow-Origin': '*'
          }),
          withCredentials: true
        })
      );
    });

    it('should handle error response', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error');
      
      await getStoredPosts();
      
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getPostPhoto', () => {
    const fileName = 'test.jpg';

    it('should successfully retrieve a photo', async () => {
      const mockPhotoData = 'base64-encoded-photo';
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockPhotoData });

      const result = await getPostPhoto(fileName);

      expect(result).toEqual(mockPhotoData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://localhost:8080/s3bucket/trackr-photo-store/download/${fileName}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockCleanToken}`
          })
        })
      );
    });
  });

  describe('usernameifAuthorized', () => {
    it('should successfully verify authorization', async () => {
      const mockUserData = { username: 'testUser' };
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockUserData });

      const result = await usernameifAuthorized();

      expect(result).toEqual(mockUserData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8080/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockCleanToken}`
          })
        })
      );
    });
  });

  describe('getTrackers', () => {
    const mockUserId = 1;
    const mockGoalId = 2;

    it('should successfully retrieve trackers', async () => {
      const mockTrackers = [{ id: 1, name: 'Test Tracker' }];
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockTrackers });

      const result = await getTrackers(mockUserId, mockGoalId);

      expect(result).toEqual(mockTrackers);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://localhost:8080/Tracker/${mockUserId}/${mockGoalId}`,
        expect.any(Object)
      );
    });
  });

  describe('sendTypeFilter', () => {
    it('should successfully send search type filter', async () => {
      const mockSearchType: searchType = {
          type: 'test',
          value: ''
      };
      mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });

      await sendTypeFilter(mockSearchType);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/filter',
        mockSearchType,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  describe('getFilteredPost', () => {
    it('should successfully retrieve filtered posts', async () => {
      const mockPosts = [{ id: 1, content: 'Filtered post' }];
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockPosts });

      const result = await getFilteredPost();

      expect(result).toEqual(mockPosts);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8080/filter/live/post',
        expect.any(Object)
      );
    });
  });
});