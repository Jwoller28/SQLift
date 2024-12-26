import React, { useState } from 'react'
import PostFeedDumb from './PostFeedDumb';
import { useRef } from 'react';
import {Post, sendPost } from '../../API/Axios';


function PostFeedSmart() {
    const [message, setMessage] = useState("");
    const [goalId, setGoalId] = useState(0);
    const [user, setUser] = useState(0);
    const form = useRef<HTMLFormElement | undefined>(undefined); //more react friendly way of getting document objects
    

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        let photo = formData.get("img_url") as File;

        const reader = new FileReader();
        reader.onloadend = async () => {
            let blobPhoto = reader.result as string;

             // Create a Post object to send as JSON
        let post: Post = {
                goal_id: parseInt(formData.get("goal_id") as string),
                user_id: parseInt(formData.get("user_id") as string),
                message_text: formData.get("message_text") as string,
                photo: blobPhoto,  // Attach the Base64 photo string
            };

        try{
            await sendPost(post);
            
          }
          catch(error : any)
          {
            if(error.request) // Request made with no Response Back
            {
                console.log(error);
            }
          }
        }
          reader.readAsDataURL(photo);
    }

    return (
        <div>
            <PostFeedDumb formRef = {form} setMessage = {setMessage} setGoalId= {setGoalId} setUser = {setUser} onSubmit = {handleSubmit}></PostFeedDumb>
        </div>
    )
}
export default PostFeedSmart;