import axios from "axios";

export default async function handler(req, res) {

  const token = req.headers.authorization.split(" ")[1];
  const search_query = req.query.search_query;

  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/search_file_general/${search_query}`,
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
