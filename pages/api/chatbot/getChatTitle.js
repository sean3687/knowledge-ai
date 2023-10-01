import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  const { chat_id } = req.body;
  console.log("getchattitle: 1")
  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/update_chat_subject/${chat_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("getchattitle: 2")
    res.status(200).json({ success: true });
    
  } catch (error) {
    res.status(500).json({
      message: "Failed to update title",
    });
  }
}
