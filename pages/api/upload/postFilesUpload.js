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
          const { data } = await axios.post('https://chitchatrabbit.me/uploadfiles', req, axiosConfig);
          data.pipe(res);  
          res.status(200).json({
              file: data.response,
              message: "File upload in queue"
          });
      } catch (error) {
          


          res.status(500).json({
              file: [],
              message: "File upload failed"
          });
      }
  } else {
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;