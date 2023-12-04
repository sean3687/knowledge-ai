import axios from "axios";

export default async function handler(req, res) {
    const { username } = req.query;
  
    try {
      const response = await axios.get(
        `https://chitchatrabbit.me/klib/send_verification_email?username=${username}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data && response.data.msg) {
        res.status(200).json({ success: true, message: response.data.msg });
      } else {
        throw new Error("Failed to get a valid response from external service");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({
          success: false,
          message: "Please Register First",
        });
      } else if (error.response && error.response.status === 400) {
        res.status(400).json({
          success: false,
          message: "Failed to send email",
        });
      } else {
        res.status(500).json({ success: false, message: `Please try again` });
      }
    }
  }