import axios from "axios";
import moment from "moment";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  
  const { chat_id } = req.body;
  console.log("chatid post deleteChat", chat_id);
  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/klib/delete_chat/${chat_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      message: { message: response.data.message },
    });
  } catch (error) {
    res.status(500).json({
      message: { message: error },
    });
  }
}
