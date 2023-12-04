import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  const { chat_id } = req.query;
 
  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/klib/get_source/${chat_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("in progress api route finish1", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.log("in progress api route finish2", response.data);
    res.status(500).json({ source: "error" });
  }
}
