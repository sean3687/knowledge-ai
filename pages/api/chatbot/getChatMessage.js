import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  
  const { chat_id } = req.query;

  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/get_chat_message/${chat_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const messages = response.data;
    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json(
      []
    );
  }
}
