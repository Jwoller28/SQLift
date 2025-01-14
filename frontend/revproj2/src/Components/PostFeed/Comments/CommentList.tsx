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

  useEffect(() => {
    if (!prop.post) return; // Check if post object is available
    setLoadingPost(true); // Set loading state when starting to fetch post
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const prevComments = await getCommentsByPost(prop.post.postId);
        setComments(prevComments as any[]);
      } catch (err) {
        setError("Failed to load comments");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
        setLoadingPost(false);
      }
    };
    fetchComments();
  }, [prop.post.postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!prop.post) {
      setError("Post or user data is not available");
      return;
    }

    let formData = new FormData();
    const userid = localStorage.getItem('id') || 0;
    formData.append("user_id", userid.toString());
    formData.append("post_id", prop.post.postId.toString());
    formData.append("message_text", message);

    try {
      await sendComment(formData);
      const prevComments = await getCommentsByPost(prop.post.postId);
      setComments(prevComments as any[]);
    } catch (err) {
      console.error("Error sending comment:", err);
      setError("Failed to submit comment");
    } finally {
      formRef.current?.reset();
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const difference = now.getTime() - commentTime.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };

  const renderComments = (comments: any[]) => (     <ul>      {comments.map((comment) => (        
  <li key={comment.commentId}>
    <h5>{comment.user.username}</h5>
    <p>{comment.timestamp}</p>
    <p>{comment.text}</p>
    <button onClick={() => handleSubmit(comment.commentId)}>Reply</button>          
    {comment.subComments && renderComments(comment.subComments)}        
    </li> ))} </ul> );

  return (
    <>
      {loadingPost && <p>Loading post...</p>}

      {!loadingPost && (
        <>
          {loading ? (
            <p>Loading comments...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : comments.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {comments.map((comment, index) => (
<<<<<<< HEAD
                <li key={index}> {/* Use unique comment ID as the key */} 
                  <h5>{comment.user.username}</h5> {/* Replace with actual comment data */}
		              <p> {comment.timestamp} </p>
		              <p>{comment.text}</p>
=======
                <li
                  key={index}
                  style={{
                    backgroundColor: "#2F2F2F",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    textAlign: "center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "1rem",
                    }}
                  >
                    {comment.user.username}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#aaa",
                      marginBottom: "5px",
                    }}
                  >
                    {formatTimeAgo(comment.timestamp)}
                  </p>
                  <p>{comment.text}</p>
>>>>>>> origin/main
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </>
      )}

      {!loadingPost && !loading && (
        <CommentDumb
          formRef={formRef}
          setMessage={setMessage}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default CommentList;