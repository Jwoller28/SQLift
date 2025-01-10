import axios from 'axios';
import {
    sendPost, getStoredPosts, getPostPhoto, sendPostPhoto, getPost,
    usernameifAuthorized, getTrackers, getUserByUsername, getGoalbyUserId,
    getGoalsbyUserId, getCommentsByPost, sendComment, sendTypeFilter,
    getFilteredPost, getFilteredStoredPosts
} from '../API/Axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Axios API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendPost', () => {
        it('should send post successfully', async () => {
            const formData = new FormData();
            const response = { status: 200 };
            mockedAxios.post.mockResolvedValue(response);

            await sendPost(formData);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                "http://localhost:8080/posts",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(console.log).toHaveBeenCalledWith("Message sent successfully!");
        });

        it('should handle error when sending post', async () => {
            const formData = new FormData();
            const error = new Error('Network Error');
            mockedAxios.post.mockRejectedValue(error);

            await sendPost(formData);

            expect(console.error).toHaveBeenCalledWith("Error sending message:", error);
        });
    });

    describe('getStoredPosts', () => {
        it('should retrieve stored posts successfully', async () => {
            const posts = [{ id: 1, content: 'Test post' }];
            const response = { status: 200, data: posts };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getStoredPosts();

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/posts",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(posts);
        });

        it('should handle error when retrieving stored posts', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getStoredPosts();

            expect(console.error).toHaveBeenCalledWith("Error sending message: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getPostPhoto', () => {
        it('should retrieve photo successfully', async () => {
            const fileName = 'test.jpg';
            const photo = { data: 'photoData' };
            const response = { status: 200, data: photo };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getPostPhoto(fileName);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                `http://localhost:8080/s3bucket/trackr-photo-store/download/${fileName}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(photo);
        });

        it('should handle error when retrieving photo', async () => {
            const fileName = 'test.jpg';
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getPostPhoto(fileName);

            expect(console.error).toHaveBeenCalledWith("Error sending message:", error);
            expect(result).toBeUndefined();
        });
    });

    describe('sendPostPhoto', () => {
        it('should send photo successfully', async () => {
            const photo = new FormData();
            const response = { status: 200 };
            mockedAxios.post.mockResolvedValue(response);

            await sendPostPhoto(photo);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                "http://localhost:8080/s3bucket/trackr-photo-store/upload",
                photo,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(console.log).toHaveBeenCalledWith("Photo Sent Successfully!");
        });

        it('should handle error when sending photo', async () => {
            const photo = new FormData();
            const error = new Error('Network Error');
            mockedAxios.post.mockRejectedValue(error);

            await sendPostPhoto(photo);

            expect(console.error).toHaveBeenCalledWith("Error sending Photo:", error);
        });
    });

    describe('getPost', () => {
        it('should retrieve post successfully', async () => {
            const post = { id: 1, content: 'Test post' };
            const response = { status: 200, data: post };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getPost();

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/live/posts",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(post);
        });

        it('should handle error when retrieving post', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getPost();

            expect(console.error).toHaveBeenCalledWith("Error retrieving message:", error);
            expect(result).toBeUndefined();
        });
    });

    describe('usernameifAuthorized', () => {
        it('should retrieve username successfully', async () => {
            const username = 'testuser';
            const response = { status: 200, data: username };
            mockedAxios.get.mockResolvedValue(response);

            const result = await usernameifAuthorized();

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/me",
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': "Bearer null",
                    },
                    'withCredentials': true
                }
            );
            expect(result).toEqual(username);
        });

        it('should handle error when retrieving username', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await usernameifAuthorized();

            expect(console.error).toHaveBeenCalledWith("Error retrieving username: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getTrackers', () => {
        it('should retrieve trackers successfully', async () => {
            const trackers = [{ id: 1, name: 'Test tracker' }];
            const response = { status: 200, data: trackers };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getTrackers(1, 1);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/Tracker/1/1",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(trackers);
        });

        it('should handle error when retrieving trackers', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getTrackers(1, 1);

            expect(console.error).toHaveBeenCalledWith("Error retrieving trackers: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getUserByUsername', () => {
        it('should retrieve user by username successfully', async () => {
            const user = { id: 1, username: 'testuser' };
            const response = { status: 200, data: user };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getUserByUsername('testuser');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/username/testuser",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(user);
        });

        it('should handle error when retrieving user by username', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getUserByUsername('testuser');

            expect(console.error).toHaveBeenCalledWith("Error retrieving user: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getGoalbyUserId', () => {
        it('should retrieve goal by user ID successfully', async () => {
            const goal = { id: 1, name: 'Test goal' };
            const response = { status: 200, data: goal };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getGoalbyUserId(1);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/goalUser/1",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(goal);
        });

        it('should handle error when retrieving goal by user ID', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getGoalbyUserId(1);

            expect(console.error).toHaveBeenCalledWith("Error retrieving goal: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getGoalsbyUserId', () => {
        it('should retrieve goals by user ID successfully', async () => {
            const goals = [{ id: 1, name: 'Test goal' }];
            const response = { status: 200, data: goals };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getGoalsbyUserId(1);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/goalsUser/1",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(goals);
        });

        it('should handle error when retrieving goals by user ID', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getGoalsbyUserId(1);

            expect(console.error).toHaveBeenCalledWith("Error retrieving goals: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getCommentsByPost', () => {
        it('should retrieve comments by post ID successfully', async () => {
            const comments = [{ id: 1, content: 'Test comment' }];
            const response = { status: 200, data: comments };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getCommentsByPost(1);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/fetch/comment/1",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(comments);
        });

        it('should handle error when retrieving comments by post ID', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getCommentsByPost(1);

            expect(console.error).toHaveBeenCalledWith("Error retrieving Post Comments: ", error);
            expect(result).toBeUndefined();
        });
    });

    describe('sendComment', () => {
        it('should send comment successfully', async () => {
            const comment = new FormData();
            const response = { status: 200 };
            mockedAxios.post.mockResolvedValue(response);

            await sendComment(comment);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                "http://localhost:8080/create/comment",
                comment,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(console.log).toHaveBeenCalledWith("Comment Sent!");
        });

        it('should handle error when sending comment', async () => {
            const comment = new FormData();
            const error = new Error('Network Error');
            mockedAxios.post.mockRejectedValue(error);

            await sendComment(comment);

            expect(console.error).toHaveBeenCalledWith("Error sending Comment:", error);
        });
    });

    describe('sendTypeFilter', () => {
        it('should send type filter successfully', async () => {
            const searchType = { type: 'test', value: 'test' };
            const response = { status: 200 };
            mockedAxios.post.mockResolvedValue(response);

            await sendTypeFilter(searchType);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                "http://localhost:8080/filter",
                searchType,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        'Access-Control-Allow-Origin': "*"
                    },
                    withCredentials: true
                }
            );
            expect(console.log).toHaveBeenCalledWith("Type sent successfully!");
        });

        it('should handle error when sending type filter', async () => {
            const searchType = { type: 'test', value: 'test' };
            const error = new Error('Network Error');
            mockedAxios.post.mockRejectedValue(error);

            await sendTypeFilter(searchType);

            expect(console.error).toHaveBeenCalledWith("Error sending Type:", error);
        });
    });

    describe('getFilteredPost', () => {
        it('should retrieve filtered post successfully', async () => {
            const post = { id: 1, content: 'Test post' };
            const response = { status: 200, data: post };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getFilteredPost();

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/filter/live/post",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(post);
        });

        it('should handle error when retrieving filtered post', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getFilteredPost();

            expect(console.error).toHaveBeenCalledWith("Error retrieving message:", error);
            expect(result).toBeUndefined();
        });
    });

    describe('getFilteredStoredPosts', () => {
        it('should retrieve filtered stored posts successfully', async () => {
            const posts = [{ id: 1, content: 'Test post' }];
            const response = { status: 200, data: posts };
            mockedAxios.get.mockResolvedValue(response);

            const result = await getFilteredStoredPosts();

            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://localhost:8080/filter/posts",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer null",
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(posts);
        });

        it('should handle error when retrieving filtered stored posts', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            const result = await getFilteredStoredPosts();

            expect(console.error).toHaveBeenCalledWith("Error sending message: ", error);
            expect(result).toBeUndefined();
        });
    });
});