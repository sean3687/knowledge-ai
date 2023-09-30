import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  const { chat_id } = req.body;

  try {
    const response = await axios.get(
      `http://54.193.180.218:8000/get_chat_message/${chat_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.status(200).json({ messages: response.data });

  } catch (error) {
    res.status(500).json({
      message: "Failed to load messages",
    });
  }
}
