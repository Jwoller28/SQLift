import axios from "axios";

const API_URL = "http://localhost:8080/posts";

export interface Post {
    post_id?: number;
    goal_id: number;
    user_id: number;
    message_text: string;
    photo: string;  // Photo will be a Base64 string or URL
}

export const sendPost = async (post: Post) => {
    try {
        await axios.post("http://localhost:8080/posts", post, {
            headers: {
                "Content-Type": "application/json"  // Send as JSON
            }
        });
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
};