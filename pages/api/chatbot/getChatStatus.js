import axios from "axios";

export default async function handler(res) {
  const url = `https://chitchatrabbit.me/send_verification_email`;
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "failed" });
  }
}
