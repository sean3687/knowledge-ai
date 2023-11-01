import axios from "axios";

export default async function handler(req, res) {
    const { otp } = req.query;
    try {
      const response = await axios.get(
        `https://chitchatrabbit.me/verify_email_code?verification_code=${otp}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
    
      res.status(200).json({ success: true, message: "Successfully register" });
     
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({
          success: false,
          message: "Wrong verification code",
        });
      } else if (error.response && error.response.status === 400) {
        res.status(400).json({
          success: false,
          message: "Please try again",
        });
      } else {
        res.status(500).json({ success: false, message: `Please try again` });
      }
    }
  }
