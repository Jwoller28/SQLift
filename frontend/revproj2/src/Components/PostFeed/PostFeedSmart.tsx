import React, { MutableRefObject, useState } from 'react'
import PostFeedDumb from './PostFeedDumb';

import { useRef } from 'react';
import {sendPost, sendPostPhoto } from '../../API/Axios';
import { restElement } from '@babel/types';

interface PostFeedProp {
	goalId : number;
	userId: number;
}

function PostFeedSmart(prop : PostFeedProp) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [tags, setTags] = useState("");
    const formRef : MutableRefObject<HTMLFormElement | null> = useRef(null);

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        let formData = new FormData();
	console.log(prop.goalId);
        formData.append('goal_id', prop.goalId.toString());
        formData.append('user_id', prop.userId.toString());
        formData.append('message_text', message);
        formData.append('message_tags', tags)
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
                formData.delete("message_tags");
                formData.delete("photo");
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
            <PostFeedDumb formRef = {formRef} setFile = {setFile} setMessage = {setMessage} setTags = {setTags} onSubmit = {handleSubmit}></PostFeedDumb> </div>

 	</>
    )
}
export default PostFeedSmart;
