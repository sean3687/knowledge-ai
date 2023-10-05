import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  const { chat_id } = req.body;

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
    const convertedMessages = messages.map(message => {
      let sender, actualMessage;
    
      if (message.startsWith('Human:')) {
        sender = 'me';
        actualMessage = message.slice('Human: '.length);
      } else {
        sender = 'bot';
        actualMessage = message.slice('AI: '.length);
      }
    
      return {
        sender: sender,
        message: actualMessage,
        time: ''  
      };
    });
    console.log("This is getChatMessage from API",convertedMessages )
    res.status(200).json(convertedMessages);

  } catch (error) {
    res.status(500).json(
      []
    );
  }
}
