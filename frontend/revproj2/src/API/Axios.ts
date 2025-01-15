import axios from "axios";
import { useState } from 'react';
import {searchType} from '../Components/PostFeed/FeedSearch';


const Token : string | null = localStorage.getItem('token');
console.log(Token);

export const sendPost = async (formData : FormData) => {
    try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8081/posts";

        await axios.post(url, formData, {
            headers: { 
		"Content-Type": "multipart/form-data",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
            },
	    withCredentials: true
        });
        console.log("Message sent successfully!");
    } 
    catch (error : any) {
        console.error("Error sending message:", error);
    }
};

export const getStoredPosts = async () => {
	try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	const url = "http://localhost:8081/posts";

	let result = await axios.get(url, {
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		"Access-Control-Allow-Origin":"*"
		},
		withCredentials: true
	});
	if(result && result.status == 200)
		{
		console.log("Stored Posts Shown");	
		console.log(result.data);
		return result.data;
		}
	else
		{
		throw new Error;
		}
	}
	catch(error: any)
	{
		console.error("Error sending message: ", error);
	}
};

export const getPostPhoto = async (fileName : string) => {
    try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = `http://localhost:8081/s3bucket/trackr-photo-store/download/${fileName}`;

        let result = await axios.get(url, {
            headers: { 
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
            },
	    withCredentials: true
        });

	if(result && result.status === 200)
		{
		console.log("Photo retrieved!");
		console.log(result.data);
		return result.data;
		}
	else 
	{
		throw new Error;
	}

    } 
    catch (error : any) {
        console.error("Error sending message:", error);
    }
};

export const sendPostPhoto = async (photo : FormData) => {
    try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8081/s3bucket/trackr-photo-store/upload";

        await axios.post(url, photo, {
            headers: { 
		"Content-Type": "multipart/form-data",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
            },
	    withCredentials: true
        });
        console.log("Photo Sent Successfully!");
    } 
    catch (error : any) {
        console.error("Error sending Photo:", error);
    }

}

export const getPost = async () => {
    try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8081/live/posts";

        let result = await axios.get(url, {
		headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		},
		withCredentials: true
	});
        if(result && result.status === 200)
        {
            console.log("Post Retrieved!");
            console.log(result.data);
            return result.data;
        }
        else{
            throw new Error;
        }
        
    } catch (error : any) {
        console.error("Error retrieving message:", error);
    }
}

export const usernameifAuthorized = async () => {
	try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	console.log(Token);
	const url = "http://localhost:8081/me";

	let result = await axios.get(url, {
		headers: {
		"Content-Type":"application/json",
		'Access-Control-Allow-Origin':"*",
		'Authorization': "Bearer " + cleanToken,
		},
		'withCredentials': true

	});

	if(result && result.status === 200)
	{
		console.log("Authorized User");
		return result.data;
	}
	else
	{
		throw new Error;
	}
	}
	catch (error: any) {
		console.error("Error retrieving username: ", error);
	}
	
}

export const getTrackers = async (userId: number, goalId: number) => {
	try {
	
	 const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	 const url =`http://localhost:8081/Tracker/${userId}/${goalId}`;
 
	 let result = await axios.get(url, {
		 headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin':"*"
		 },
		 withCredentials: true

	 });
	 if(result && result.status == 200)
	{
	   console.log("Trackers received");
	   console.log(url);
	   console.log(result.data);
	   return result.data;
	}
	else {
	   throw new Error;
	}

	}
	catch(error : any) {
		console.error("Error retrieving trackers: ", error);
	}
}

export const getUserByUsername = async (username : string) => {

	try {
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	const url1= `http://localhost:8081/username/${username}`;
	
	let result1 = await axios.get(url1, {
		headers: {
		"Content-Type": "application/json",
		Authorization:"Bearer " + cleanToken,
		'Access-Control-Allow-Origin':"*"
		},
		withCredentials: true
	});
	if(result1 && result1.status === 200)
	{
		console.log("User acquired")
		console.log(result1.data);
		return result1.data;
	}
	else {
		throw new Error;
	}
	}
	catch(error : any) {
		console.error("Error retrieving user: ", error);
	}
}

export const getGoalbyUserId = async(userId : number) => {
	try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	const url2 = `http://localhost:8081/goalUser/${userId}`;

	let result2 =  await axios.get(url2, {
		headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
		},
		withCredentials: true
	});
	if(result2 && result2.status === 200)
	{
		console.log("Goal acquired");
		console.log(result2.data);
		return result2.data;
	}
	else
	{
		throw new Error;
	}
	}
	catch(error: any) {
		console.error("Error retrieving goal: ", error);
	}
}


export const getGoalsbyUserId = async(userId : number) => {
	try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	const url2 = `http://localhost:8081/goalsUser/${userId}`;

	let result2 =  await axios.get(url2, {
		headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
		},
		withCredentials: true
	});
	if(result2 && result2.status === 200)
	{
		console.log("Goal acquired");
		console.log(result2.data);
		return result2.data;
	}
	else
	{
		throw new Error;
	}
	}
	catch(error: any) {
		console.error("Error retrieving goals: ", error);
	}
}

export const getCommentsByPost = async(postId : number) => {
	try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	const url = `http://localhost:8081/fetch/comment/${postId}`;

	let result =  await axios.get(url, {
		headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
		},
		withCredentials: true
	});
	if(result && result.status === 200)
	{
		console.log("Comments for Post acquired");
		console.log(result.data);
		return result.data;
	}
	else
	{
		throw new Error;
	}
	}
	catch(error: any) {
		console.error("Error retrieving Post Comments: ", error);
	}
}


export const sendComment = async (comment : FormData) => {
    try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8081/create/comment";
		console.log(comment);
        await axios.post(url, comment, {
            headers: { 
		"Content-Type": "multipart/form-data",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
            },
	    withCredentials: true
        });
        console.log("Comment Sent!");
    } 
    catch (error : any) {
        console.error("Error sending Comment:", error);
    }
}



export const sendTypeFilter = async (searchType : searchType) => {
    try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8081/filter";

        await axios.post(url, searchType, {
            headers: { 
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
            },
	    withCredentials: true
        });
        console.log("Type sent successfully!");
    } 
    catch (error : any) {
        console.error("Error sending Type:", error);
    }
};

export const getFilteredPost = async () => {
    try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8081/filter/live/post";

        let result = await axios.get(url, {
		headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		},
		withCredentials: true
	});
        if(result && result.status === 200)
        {
            console.log("Filtered Post Retrieved!");
            console.log(result.data);
            return result.data;
        }
        else{
            throw new Error;
        }
        
    } catch (error : any) {
        console.error("Error retrieving message:", error);
    }
}

export const getFilteredStoredPosts = async () => {
	try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
	const url = "http://localhost:8081/filter/posts";

	let result = await axios.get(url, {
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		"Access-Control-Allow-Origin":"*"
		},
		withCredentials: true
	});
	if(result && result.status == 200)
		{
		console.log("Filtered Stored Posts Shown");	
		console.log(result.data);
		return result.data;
		}
	else
		{
		throw new Error;
		}
	}
	catch(error: any)
	{
		console.error("Error sending message: ", error);
	}
};