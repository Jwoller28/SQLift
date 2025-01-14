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

<<<<<<< HEAD
    fetchPosts();
  }, [searched, searchQuery]);
=======
    getDB();
  }, [searched]);
>>>>>>> origin/main

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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const createdDate = new Date(dateString);

    if (isNaN(createdDate.getTime())) {
      return "Invalid date";
    }

    const difference = now.getTime() - createdDate.getTime();
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };
  
  return (
<<<<<<< HEAD
    <div>
      <h3>We will get there Together!</h3>
      <FeedSearch 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        searched={searched}
      />
      <div>
        {searched && posts.length === 0 && <p>No Posts Match this Criteria</p>}
=======
    <div
      style={{
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Georgia, serif',
      }}
    >
      <h3
        style={{
          color: '#fff',
          fontSize: '3rem',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        Feed
      </h3>
      <div
        style={{
          width: '80%',
          maxWidth: '800px',
          background: 'linear-gradient(to bottom, #2F2F2F, #1A1A1A)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FeedSearch onChange={onChange} setSearched={setSearched} />
      </div>
  
      <div
        style={{
          marginTop: '20px',
          width: '80%',
          maxWidth: '800px',
          textAlign: 'center',
        }}
      >
        {searched && posts.length === 0 && (
          <p
            style={{
              backgroundColor: '#ff4444',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            No Posts Match this Criteria
          </p>
        )}
>>>>>>> origin/main
        {posts.length === 0 ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => (
<<<<<<< HEAD
            <div key={post.postId}>
              <h5>Goal ID: {post.goal.id}</h5>
              <a>User ID: {post.user.id}</a>
              <p>Username: {post.user.username}</p>
              <p>Message Text: {post.messageText}</p>
              <p>Date: {post.creation}</p>
              {post.tags?.length > 0 && (
=======
            <div
              key={post.postId}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                loading="lazy"
                src={post.photo}
                alt="Post image"
                style={{
                  marginTop: '10px',
                  width: '200px',
                  height: 'auto',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              /><br/>
              <p>By {post.user.username}</p>
              <p>{post.messageText}</p>
              <p><em>Posted {formatTimeAgo(post.creation)}</em></p>
              {post.tags && post.tags.length > 0 && (
>>>>>>> origin/main
                <p>Tags: {formatTags(post.tags)}</p>
              )}
              <hr
                style={{
                  border: '1px solid #504dff',
                  margin: '20px 0',
                  width: '90%',
                }}
              />
              <button
                onClick={() => handleClick(post.postId)}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#504dff',
                  color: '#fff',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Comment
              </button>
              <br/>
              <br/>
              {click[post.postId] && <CommentList post={post} />}
<<<<<<< HEAD
              {post.photo && (
                <img 
                  loading="lazy" 
                  src={post.photo} 
                  width="200" 
                  height="auto" 
                  alt=""
                />
              )}
=======
              
>>>>>>> origin/main
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  
}

export default PostList;