import axios from "axios";



export const sendPost = async (formData : FormData) => {
    try {
        const url = "http://localhost:8080/posts";

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
        const url = "http://localhost:8080/posts";

        let result = await axios.get(url, {
            headers: { "Content-Type": "application/json"
            }
        });
        console.log("Post Retrieved!");
        console.log(result.data);
        return result.data;
    } catch (error) {
        console.error("Error retrieving message:", error);
    }
};