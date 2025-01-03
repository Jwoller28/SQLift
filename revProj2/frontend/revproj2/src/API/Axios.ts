import axios from "axios";
import { useState } from 'react';


const Token : string | null = localStorage.getItem('token');
console.log(Token);

export const sendPost = async (formData : FormData) => {
    try {

	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8080/posts";

        await axios.post(url, formData, {
            headers: { 
		"Content-Type": "multipart/form-data",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
            }
        });
        console.log("Message sent successfully!");
    } 
    catch (error : any) {
        console.error("Error sending message:", error);
    }
};

export const getPosts = async () => {
    try {
	
	const Token = localStorage.getItem('token');
	const cleanToken = Token?.replace(/"/g, "");
        const url = "http://localhost:8080/posts";

        let result = await axios.get(url, {
		headers: {
		"Content-Type": "application/json",
		Authorization:`Bearer ${Token}`,
		'Access-Control-Allow-Origin': "*"
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
	const url = "http://localhost:8080/me";

	let result = await axios.get(url, {
		headers: {
		"Content-Type":"application/json",
<<<<<<< HEAD
		Authorization: `Bearer ${Token}`,
		'Access-Control-Allow-Origin':"*"
		}
=======
		'Authorization': "Bearer " + cleanToken,
		},
		'withCredentials': true
>>>>>>> 7560f915e (Fixed quotation issue, thanks Bret)
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
	 const url =`http://localhost:8080/Tracker/${userId}/${goalId}`;

	 let result = await axios.get(url, {
		 headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin':"*"
		 }

	 });
	 if(result && result.status == 200)
	{
	   console.log("Trackers received");
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
	const url1= `http://localhost:8080/username/${username}`;
	
	let result1 = await axios.get(url1, {
		headers: {
		"Content-Type": "application/json",
		Authorization:"Bearer " + cleanToken,
		'Access-Control-Allow-Origin':"*"
		}
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
	const url2 = `http://localhost:8080/goalUser/${userId}`;

	let result2 =  await axios.get(url2, {
		headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + cleanToken,
		'Access-Control-Allow-Origin': "*"
		}
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
	const url2 = `http://localhost:8080/goalsUser/${userId}`;

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
