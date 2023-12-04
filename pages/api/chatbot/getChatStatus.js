import axios from "axios";

export default async function handler(req, res) {
  const { chat_id } = req.query; 
  const token = req.headers.authorization.split(" ")[1];

  const url = `https://chitchatrabbit.me/klib/get_chat_status/${chat_id}`;

  try {
    const response = await axios.get(url, { 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    const chatStatus = response.data; 

    res.status(200).json({ chatStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
