import axios from "axios";

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const token = req.headers.authorization.split(" ")[1];
  const { search_query } = req.body;

  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/klib/search_file_by_label/${search_query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Return the same response to the client
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(200).json([]);
  }
}
