import axios from "axios";

export default async function handler(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const file_id = req.query.file_id;
    console.log("this is from nextjs route"+ file_id)
    try {
        const response = await axios.get(`https://chitchatrabbit.me/klib/upload_status/${file_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("getFileUploadStatus from api/postFileUploadStatus",response.data.upload_status)
        res.status(200).json({
           upload_status: response.data.upload_status,
        });
    } catch (error) {
        
        res.status(500).json({
            upload_status: "errorssssssssssss"
        });
    }
}