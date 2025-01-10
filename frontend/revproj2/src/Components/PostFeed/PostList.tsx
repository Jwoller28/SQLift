import React, { useState, useEffect } from 'react';
import { getStoredPosts, getPost, getFilteredPost, getFilteredStoredPosts } from '../../API/Axios';
import { useLocation } from 'react-router-dom';
import FeedSearch from './FeedSearch';
import CommentList from './Comments/CommentList';

function PostList() {
  const [posts, setPosts] = useState<any[]>([]); // Ensure this is always an array
  const [postIds, setPostIds] = useState<number[]>([]); // Track post IDs in state
  const location = useLocation();
  const [click, setClick] = useState<{ [key: number]: boolean }>({});
  const [change, onChange] = useState("");
  const [searched, setSearched] = useState(false);

  // Polling for new posts
  useEffect(() => {
    let interval: any;

    if (location.pathname === '/feed') {
      const poll = async () => {
        try {
          let newPost;
          if (searched === false && change === "") {
            newPost = await getPost();
          } else {
            newPost = await getFilteredPost();
          }

          if (!newPost) {
            throw new Error('No new post');
          } else {
            if (!postIds.includes(newPost.post_id)) {
              console.log('New Post: ' + newPost);
              setPostIds((prevPostIds) => [...prevPostIds, newPost.post_id]);
              setPosts((prevPosts) => [newPost, ...prevPosts]);
            }
          }
        } catch (error) {
          console.error('Error during Polling: ', error);
        }
      };

      poll();
      interval = setInterval(poll, 5000);

      return () => clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [location.pathname, change, searched, postIds]);

  // Fetching posts from the database (initial and filtered)
  useEffect(() => {
    const getDB = async () => {
      let postList;
      if (searched === false && change === "") {
        postList = await getStoredPosts();
      } else {
        postList = await getFilteredStoredPosts();
      }
      console.log('Get Stored Posts: ', postList);
      setPosts(postList || []); // Ensure it's always an array
    };

    getDB();
  }, [searched, change]);

  // Handling comment toggling
  function handleClick(postId: number) {
    setClick((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  // Function to format the tags with # before each word and spaces in between
  const formatTags = (tags: string[]) => {
    return tags
      .map(tag => `#${tag}`)  // Add # before each tag
      .join(' ');             // Join tags with spaces
  };

  return (
    <div>
      <h3>We will get there Together!</h3>
      <div>
        <FeedSearch onChange={onChange} setSearched={setSearched}></FeedSearch>
      </div>
      <div>
        {searched && posts.length === 0 && <p>No Posts Match this Criteria</p>}
        {posts.length === 0 ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => (
            <div key={post.postId}> {/* Use postId as the key for better stability */}
              <h5>Goal ID: {post.goal.id}</h5>
              <a>User ID: {post.user.id}</a>
              <p>Username: {post.user.username}</p>
              <p>Message Text: {post.messageText}</p>
              <p>Date: {post.creation} </p>
              {post.tags && post.tags.length > 0 && (
                <p>Tags: {formatTags(post.tags)}</p>
              )}
              <button onClick={() => handleClick(post.postId)}>Comment</button>
              {click[post.postId] && <CommentList post={post} />}
              <img loading="lazy" src={post.photo} width="200" height="auto" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;
