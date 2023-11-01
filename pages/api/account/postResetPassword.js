import axios from "axios";
const handler = async (req, res) => {
  const { reset_code, new_password } = req.body;
  const body = { "reset_code": reset_code, "new_password": new_password };

  try {
    const response = await axios.post(
      `https://chitchatrabbit.me/reset_password`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json({ success: true, message: "Successfully Updated" });
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
        message: "Invalid Code",
      });
    } else {
      res.status(500).json({ success: false, message: `Please try again` });
    }
  }
};
export default handler;
