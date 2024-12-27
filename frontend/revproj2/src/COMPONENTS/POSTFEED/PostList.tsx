import React, { useEffect, useState } from 'react'
import { getPosts } from '../../API/Axios';

export interface Post {
    post_id:number;
    goal_id:number;
    user_id:number;
    message_text:string;
    photo:Blob;

}
function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
  
    useEffect(() => {
          const data = getPosts();
          data.then((result) => {setPosts(result);})
      }
    , [])
    return (
      <div>
          <h3>Consumed Messages: </h3>
              <ul>
                  {posts.map((post,index) => (
                      <li key = {index}>{post.user_id}</li>
                  ))}
              </ul>
      </div>
    )
  }
  
  export default PostList
