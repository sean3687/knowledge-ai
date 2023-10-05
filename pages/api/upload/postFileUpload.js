import axios from "axios";

const baseURL = "https://chitchatrabbit.me";  // The address of your external server

export const config = {
  api: {
    bodyParser: false,  // Disabling body parser
  },
};

async function handler(req, res) {
  const token = req.headers.authorization.split(' ')[1]; // Extracting token for authorization
  console.log("check this req"+req)
  let uploadPhotoAddress = baseURL + "/uploadfile";  // The endpoint on your external server

  if (req.method === "POST") {
    const axiosConfig = {
      responseType: "stream",
      headers: {
        "Content-Type": req.headers["content-type"],  // Forward the Content-Type header
        "Authorization": `Bearer ${token}`  // Set the authorization header
      },
    };
    

    try {
      const { data } = await axios.post(uploadPhotoAddress, req, axiosConfig);
      data.pipe(res);  // Pipe the response data from the backend server to the client
      res.status(200).json({
        success: true,
        message: "Upload Completed",
      });
    } catch (error) {
      // Handle errors from the backend server
      const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
      res.status(error.response?.status || 500).json({
        message: errorMessage,
        success: false
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;