import axios from "axios";

export default async function handler(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    console.log("this is token "+token)
  
    try {
        const response = await axios.get(`https://chitchatrabbit.me/clear_chat_history`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        
        res.status(200).json({
            message: {message : response.data},
            
        });
    } catch (error) {
        
        const errorMessage = 
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Not authenticated";
        res.status(500).json({
            
            message: {message : errorMessage},
          
        });
    }
}