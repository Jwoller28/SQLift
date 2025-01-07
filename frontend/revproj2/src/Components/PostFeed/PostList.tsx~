import React, { useEffect, useState } from 'react'
import { getPostPhoto } from '../../API/Axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';


function PostList() {
  const Token = localStorage.getItem('token');
  const cleanToken = Token?.replace(/"/g, "");
  const [posts, setPosts] = useState<any[]>([]);
  const postIds : number[] = [];

  // Start polling function with delay
  /*const startPolling = async () => {
      while (true) {
          try {
              const newPost = await getPosts();
              if(!newPost)
              {
                throw Error;
              }
	      else
	      {
		      if(goalIds.includes(newPost.goal_id) === false)
			 {
              		console.log("New Post: " + newPost)
			goalIds.push(newPost.goal_id);
			let photo_ =  await getPostPhoto(newPost.photo);
			newPost.photo_obj = photo_;
              		setPosts((prevPosts) => [newPost, ...prevPosts]); // Appends at the start of the list
	      		}
		}
	      }
          catch (error) {
              console.error("Error during polling:", error);
          }

          // Delay between polling requests (e.g., 5 seconds)
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Adjust polling interval as needed
      }
  };*/

  useEffect(() => {
      fetchEventSource('http://localhost:8080/sse/posts', {
	      headers: {
		      'Content-Type': 'text/event-stream',
		      'Authorization': "Bearer " + cleanToken,
		      'credentials':'include'
	      		},
	      
	      onmessage(ev : any) {
		      console.log("Post Received: " + ev.data);
		      try
		      {
			      const newPost = JSON.parse(ev.data);
			      console.log(Object.keys(newPost));
			      console.log(newPost.goal);

			      if(!newPost)
				{
					throw Error;
				}
				else
				{
					if(postIds.includes(newPost.postId) === false)
						{
							console.log("New post: " + newPost);
							postIds.push(newPost.postId);
						        /*const getPhoto = async () => {
							console.log("Photo request sent")
							newPost.photo = await getPostPhoto(photo_name);
							}
							getPhoto():
							*/
							//console.log(newPost.photo);
							setPosts((prev) => [newPost,...prev]);
						}

				}


		      }
		      catch(error: any)
		      {
			      console.error("Error during polling: ", error);
		      }
	}
      } );
  }, []); // Empty dependency array ensures it runs only once


  function photoURl(photo_name : string): string {
    let url = `https://trackr-photo-store.s3.us-east-2.amazonaws.com/${photo_name}`;
    console.log(url);
    return url;
}

    return (
      <div>
          <h3>Consumed Messages: </h3>
            <div>
            {posts.map((post,index) => (
                      <div key = {index}>
                        <h5>Goal ID: {post.goal.id}</h5>
                        <p>User ID: {post.user.id}</p>
                        <p>Messge Text: {post.message_text}</p>
                        <img loading="lazy" src = {photoURl(post.photo)} width="200" height="auto"></img>
                        </div>
                  ))}
            </div>
      </div>
      )
    }
  
  export default PostList

  
  
