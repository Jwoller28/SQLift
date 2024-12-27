import React, { useState } from 'react'
import PostFeedDumb from './PostFeedDumb';
import { useRef } from 'react';
import {sendPost } from '../../API/Axios';
import PostList from './PostList';


function PostFeedSmart() {
    const [message, setMessage] = useState("");
    const [goalId, setGoalId] = useState(0);
    const [user, setUser] = useState(0);
    const [file, setFile] = useState<File | undefined>(undefined);


    const handleSubmit = async (e : any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('goal_id', goalId.toString());
        formData.append('user_id', user.toString());
        formData.append('message_text', message);
    
        if (file) {
            formData.append('photo', file);
        }

        // console.log("Before");
        // console.log(formData.get("goal_id"));
        // console.log(formData.get("user_id"));
        // console.log(formData.get("message_text"));
        // console.log(formData.get("photo"));
        try{
            await sendPost(formData);
            console.log("During");
            
          }
          catch(error : any)
          {
            if(error.request) // Request made with no Response Back
            {
                console.log(error);
            }
          }
        }
    

    return (
        <div>
            <PostFeedDumb setFile = {setFile} setMessage = {setMessage} setGoalId= {setGoalId} setUser = {setUser} onSubmit = {handleSubmit}></PostFeedDumb>

            <div>
                <PostList></PostList>
            </div>
        </div>
    )
}
export default PostFeedSmart;