import axios from "axios";

export default async function handler(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const { search_query } = req.body

    try {
        const response = await axios.get(`https://chitchatrabbit.me/klib/search_file_by_label/${search_query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
      
        res.status(200).json({
            success: true,
            message: "getQueryLabel API successfully called",
            response: response.data

        });
    } catch (error) {
        const errorMessage = 
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Not authenticated";
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
}