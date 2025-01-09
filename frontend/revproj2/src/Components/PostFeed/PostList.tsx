import React, { useState, useEffect } from 'react';
import { getStoredPosts, getPost } from '../../API/Axios';
import { useLocation } from 'react-router-dom';
import CommentList from './Comments/CommentList';

function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const postIds: number[] = [];
  const location = useLocation();
  const [click, setClick] = useState<{ [key: number]: boolean }>({}); // Ensure click is an object

  useEffect(() => {
    let interval: any;

    // Polling only if the current route is '/feed'
    if (location.pathname === '/feed') {
      const poll = async () => {
        try {
          const newPost = await getPost();
          if (!newPost) {
            throw new Error('No new post');
          } else {
            if (!postIds.includes(newPost.post_id)) {
              console.log('New Post: ' + newPost);
              postIds.push(newPost.post_id);
              setPosts((prevPosts) => [newPost, ...prevPosts]);
            }
          }
        } catch (error) {
          console.error('Error during Polling: ', error);
        }
      };

      poll(); // Run polling immediately once effect runs
      interval = setInterval(poll, 5000); // Start polling every 5 seconds

      // Cleanup function to clear the polling interval when the user navigates away
      return () => {
        if (interval) clearInterval(interval);
      };
    }

    // Cleanup if location changes (i.e., not on /feed anymore)
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [location.pathname]); // Dependency array to trigger polling on pathname change

  useEffect(() => {
    const getDB = async () => {
      let postList = await getStoredPosts();
      console.log('Get Stored Posts: ', postList);
      setPosts(postList as any[]);
    };
    getDB();
  }, []);

  // Update click state for individual post
  function handleClick(postId: number) {
    setClick((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  return (
    <div>
      <h3>Consumed Messages: </h3>
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <h5>Goal ID: {post.goal.id}</h5>
            <a>User ID: {post.user.id}</a>
            <p>Message Text: {post.message_text}</p>
            <p>Date: {post.creation} </p>
            <button>Edit</button>
            <button onClick={() => handleClick(post.postId)}>Comment</button>
            {/* Pass the entire click object, not just a boolean */}
            {click[post.postId] && <CommentList post={post} />}
            <img loading="lazy" src={post.photo} width="200" height="auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
