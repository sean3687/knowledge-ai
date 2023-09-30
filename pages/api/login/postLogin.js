import axios from "axios";

export default async function handler(req, res) {
  const { username, password } = req.body;

  const bodyRequest = {
    username: username,
    password: password,
  };

  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await axios.post(
      "http://54.193.180.218:8000/token",
      bodyRequest,
      {
        headers: header,
      }
    );

    const accessToken = response.data.access_token;

    console.log("access Token Ready from pages/api " + accessToken);
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      accessToken: accessToken,
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || "An error occurred during login.";
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}
