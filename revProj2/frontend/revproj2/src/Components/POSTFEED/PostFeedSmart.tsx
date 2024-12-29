import React, { MutableRefObject, useState } from 'react'
import PostFeedDumb from './PostFeedDumb';
import { useRef } from 'react';
import {getPosts, sendPost } from '../../API/Axios';
import { restElement } from '@babel/types';


function PostFeedSmart() {
    const [message, setMessage] = useState("");
    const [goalId, setGoalId] = useState(0);
    const [user, setUser] = useState(0);
    const [file, setFile] = useState<File | undefined>(undefined);
    const formRef : MutableRefObject<HTMLFormElement | null> = useRef(null);

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        let formData = new FormData();
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
        const sendData = async () => {
            try {
                // Send the post data and wait for it to finish
                await sendPost(formData);
                console.log("During");
        
                // Clear the formData after sending
                formData.delete("goal_id");
                formData.delete("user_id");
                formData.delete("message_text");
                formData.delete("photo");
        
                // Now that the post is sent, retrieve the updated posts
            } catch (error) {
                console.error("Error in sending data:", error);
            }
        };
        // Call the sendData function
        sendData();
        
            
        formRef.current?.reset();
            
          }
        
        

    return (
       
        <>
             <div>
            <PostFeedDumb formRef = {formRef} setFile = {setFile} setMessage = {setMessage} setGoalId= {setGoalId} setUser = {setUser} onSubmit = {handleSubmit}></PostFeedDumb>
            </div>
        </>
    )
}
export default PostFeedSmart;