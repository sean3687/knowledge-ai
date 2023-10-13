import axios from 'axios';

export default async function handler(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const { chat_id } = req.query;
    const url = `https://chitchatrabbit.me/get_chat_status/${chat_id}`;
    try {
        const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting chat status' });
    }
}


