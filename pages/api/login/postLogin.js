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
      "https://chitchatrabbit.me/klib/token",
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
    if (error.response.status === 401) {
      // If the login fails due to incorrect ID or password, return a 404 response.
      res.status(401).json({
        success: false,
        message: "ID or Password is incorrect",
      });
     
    } else {
      // Handle other errors (e.g., 500 Internal Server Error) with a 500 response.
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Please try again later.";
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      
    }
  
  }
}
