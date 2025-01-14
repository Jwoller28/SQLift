import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { sendComment, getCommentsByPost } from '../../../API/Axios';
import CommentDumb from './CommentDumb';

interface CommentListProp {
  post: any;
}

function CommentList(prop: CommentListProp) {
  const [comments, setComments] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for comments
  const [loadingPost, setLoadingPost] = useState(false); // Added loading state for post
  const [error, setError] = useState<string | null>(null); // Error state
  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);

  // Fetch comments when post or click changes
  useEffect(() => {
    if (!prop.post) return; // Check if post object is available
    setLoadingPost(true); // Set loading state when starting to fetch post
    const fetchComments = async () => {
      setLoading(true); // Set loading state for comments
      setError(null); // Reset error state before trying to fetch comments
      try {
        const prevComments = await getCommentsByPost(prop.post.postId);
        setComments(prevComments as any[]);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false); // Turn off loading once comments are fetched
        setLoadingPost(false); // Turn off loading once post is fetched
      }
    };
    fetchComments();
  }, [prop.post.postId]);  // Added post.id as dependency to refetch on post change

  // Handle new comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return; // Avoid sending empty messages

    if (!prop.post) {
      setError('Post or user data is not available');
      return;
    }

    console.log("Post data:", prop.post);
    console.log("User ID:", prop.post?.user?.id);
    console.log("Post ID:", prop.post?.postId);


    let formData = new FormData();
    formData.append('user_id', prop.post.user.id.toString());
    formData.append('post_id', prop.post.postId.toString());
    formData.append('message_text', message);

    try {
      await sendComment(formData);
      // Optionally, refetch comments after sending a comment
      const prevComments = await getCommentsByPost(prop.post.postId);
      setComments(prevComments as any[]);
    } catch (err) {
      console.error("Error sending comment:", err);
      setError('Failed to submit comment');
    } finally {
      formRef.current?.reset(); // Reset the form after submitting
    }
  };

  return (
    <>
      {/* Show loading state while the post is being loaded */}
      {loadingPost && <p>Loading post...</p>}

      {!loadingPost && (
        <>
          {loading ? (
            <p>Loading comments...</p> // Show loading while comments are being fetched
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p> // Show error if there is one
          ) : comments ? (
            <ul>
              {comments.map((comment, index) => (
                <li key={index}> {/* Use unique comment ID as the key */} 
                  <h5>{comment.user.username}</h5> {/* Replace with actual comment data */}
		              <p> {comment.timestamp} </p>
		              <p>{comment.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </>
      )}

      {!loadingPost && !loading && (
        <CommentDumb formRef={formRef} setMessage={setMessage} onSubmit={handleSubmit} />
      )}
    </>
  );
}

export default CommentList;
