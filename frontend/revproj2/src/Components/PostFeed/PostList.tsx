import React, { useState, useEffect } from 'react';
import { getStoredPosts, getPost, getFilteredPost, getFilteredStoredPosts } from '../../API/Axios';
import { useLocation } from 'react-router-dom';
import FeedSearch from './FeedSearch';
import CommentList from './Comments/CommentList';

function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [postIds, setPostIds] = useState<number[]>([]);
  const location = useLocation();
  const [click, setClick] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState(false);
  
  // Polling for new posts
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (location.pathname === '/feed') {
      const poll = async () => {
        try {
          let newPost: any;
          // Only poll for new posts when not in search mode
          if (!searched && !searchQuery) {
            newPost = await getPost();
            
            if (newPost && !postIds.includes(newPost.post_id)) {
              setPostIds(prev => [...prev, newPost.post_id]);
              setPosts(prev => [newPost, ...prev]);
            }
          }
        } catch (error) {
          console.error('Error during Polling: ', error);
        }
      };

      poll();
      interval = setInterval(poll, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [location.pathname, searched, searchQuery, postIds]);

  // Fetch posts based on search state
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let postList;
        if (!searched && !searchQuery) {
          postList = await getStoredPosts();
        } else if (searched) {
          postList = await getFilteredStoredPosts();
        }
        setPosts(postList || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [searched, searchQuery]);

  const handleClick = (postId: number) => {
    setClick(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSearch = (query: string, isSearched: boolean) => {
    setSearchQuery(query);
    setSearched(isSearched);
  };

  const formatTags = (tags: string[]) => {
    return tags.map(tag => `#${tag}`).join(' ');
  };

  return (
    <div>
      <h3>We will get there Together!</h3>
      <FeedSearch 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        searched={searched}
      />
      <div>
        {searched && posts.length === 0 && <p>No Posts Match this Criteria</p>}
        {posts.length === 0 ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => (
            <div key={post.postId}>
              <h5>Goal ID: {post.goal.id}</h5>
              <a>User ID: {post.user.id}</a>
              <p>Username: {post.user.username}</p>
              <p>Message Text: {post.messageText}</p>
              <p>Date: {post.creation}</p>
              {post.tags?.length > 0 && (
                <p>Tags: {formatTags(post.tags)}</p>
              )}
              <button onClick={() => handleClick(post.postId)}>Comment</button>
              {click[post.postId] && <CommentList post={post} />}
              {post.photo && (
                <img 
                  loading="lazy" 
                  src={post.photo} 
                  width="200" 
                  height="auto" 
                  alt=""
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;