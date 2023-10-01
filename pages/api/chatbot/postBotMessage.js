import axios from "axios";
import moment from "moment"; 

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { chat_id, message, accessToken } = req.query;

  if (!chat_id || !message || !accessToken)
    return res.status(400).send("Bad Request: Missing parameters");

  console.log("you received the message from user: ", chat_id, message);

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await axios.post(
      "http://35.220.164.17:8000/chain",
      {
        message: message,
        chat_id: chat_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "stream",
      }
    );

    if (
      response.status !== 200 ||
      !response.data ||
      typeof response.data.on !== "function"
    ) {
      console.error("Unexpected response:", response);
      return res.status(response.status || 500).send("An error occurred.");
    }
    
    console.log('Streaming started...');
    console.log('Is response.data a stream?', typeof response.data.pipe === 'function');
    
    response.data.on("data", (chunk) => {
      const strChunk = chunk.toString();
      console.log("Received chunk:", strChunk);
      const botTime = moment().format("h:mm");
      const botMessage = {
        sender: "bot",
        message: strChunk,
        time: botTime,
      };
      res.write(`data: ${JSON.stringify(botMessage)}\n\n`);
    });
    
    response.data.on("end", () => {
      console.log("Stream ended. Closing response...");
      res.end();
    });
    
    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.finished) {
        res.status(500).send('Stream Error');
      }
    });
   
   req.on('close', () => {
      console.log('Client disconnected. Destroying stream...');
      response.data.destroy(); // Close the stream and avoid throwing error in error handler
   });

  } catch (error) {
    console.error('Error:', error);
    if (!res.finished) {
      res.status(500).send('An error occurred.');
    }
  }
}
