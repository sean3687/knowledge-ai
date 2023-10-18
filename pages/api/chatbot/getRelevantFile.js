import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const { chat_id, ai_message } = req.body;

  const body = {
    "chat_id": chat_id,
    "ai_message": ai_message
  }

  try {
    const response = await axios.post(
      `https://chitchatrabbit.me/get_relevant_file`,body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load messages",
    });
  }
}
