import axios from "axios";



export const sendPost = async (formData : FormData) => {
    try {
        const url = "http://localhost:8080/api/posts";

        await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data"
            }
        });
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

export const getPosts = async () => {
    try {
        const url = "http://localhost:8080/api/posts";


        let result = await axios.get(url, {
		headers: {"Content-Type": "application/json"
		}
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
};

export const getTrackers = async (userId: number, goalId: number) => {
	try {
	 const url = 'http://localhost:8080/Tracker/${userId}/${goalId}';

	 let result = await axios.get(url, {
		 headers: {"Content-Type": "application/json"
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
	const url1= 'http://localhost:8080/username/${username}';
	
	let result1 = await axios.get(url1, {
		headers: {"Content-Type": "application/json"
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
	const url2 = 'http://localhost:8080/goalUser/${userId}';

	let result2 =  await axios.get(url2, {
		headers: {"Content-Type": "application/json"
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
