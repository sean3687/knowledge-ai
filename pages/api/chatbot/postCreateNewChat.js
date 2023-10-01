import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const response = await axios.get(`https://chitchatrabbit.me/create_chat`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ chat_id: response.data.chat_id });
  } catch (error) {
    res.status(500).json({ chat_id: -1 });
  }
}
