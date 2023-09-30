import axios from "axios";


export const config = {
  api: {
    bodyParser: false,  // Disabling body parser
  },
};

async function handler(req, res) {
  console.log("Request headers:", req.headers);
  console.log("Request body:", req);
  const token = req.headers.authorization.split(' ')[1]; // Extracting token for authorization
      
  if (req.method === "POST") {
      const axiosConfig = {
          responseType: "stream",
          headers: {
              "accept": "application/json",
              "Authorization": `Bearer ${token}`,  // Set the authorization header
              "Content-Type": req.headers["content-type"]
          }
          ,timeout: 180000
      };

      try {
          const { data } = await axios.post('http://54.193.180.218:8000/uploadfiles', req, axiosConfig);
          data.pipe(res);  
          res.status(200).json({
              success: true,
              message: "Upload Completed",
          });
      } catch (error) {
          // Handle errors from the backend server

          let errorMessage;

        //   if (error.response?.data?.detail) {
        //       // Check specific error messages
        //       if (error.response.data.detail.includes("FileType.UNK file type is not supported")) {
        //           errorMessage = "Unsupported file type.";
        //       } else if (error.response.data.detail.includes("File name conflict")) {
        //           errorMessage = "Same file found.";
        //       } else {
        //           errorMessage = error.response.data.detail;
        //       }
        //   } else {
        //       errorMessage = "Failed to upload";
        //   }

          res.status(500).json({
              message: errorMessage,
              success: false
          });
      }
  } else {
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;