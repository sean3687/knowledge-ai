import axios from 'axios';
import moment from 'moment';

export default async function handler(req, res) {
  console.log("postBotMessage API received a request");
  const token = req.headers.authorization.split(" ")[1];
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message, chat_id } = req.body;

  try {
    const response = await axios.post("https://chitchatrabbit.me/klib/chain", {
      message: message,
      chat_id: chat_id
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
      ,timeout: 180000
    });
   
    if (response.status === 200) {
      
      const botTime = moment().format("h:mm");
      const botMessage = {
        sender: "bot",
        message: response.data,
        time: botTime,
      };
      return res.status(200).json(botMessage);
    } else if (response.status === 401) {
      return res.status(401).send("Please login first");
    } else if (response.status === 400) {
      return res.status(400).json(response.data);
    } else {
      return res.status(response.status).send("An error occurred.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
}