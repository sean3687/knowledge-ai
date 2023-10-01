import axios from "axios";

export default async function handler(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const { selectedId } = req.body;
    console.log("this is from nextjs route"+ selectedId)
  try {
    const response = await axios.get(
      `https://chitchatrabbit.me/download_file/${selectedId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      }
    );
    // Set the appropriate headers dynamically based on the received content type
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${
        response.headers["content-disposition"].split("filename=")[1]
      }`
    );

    // Send the blob data directly
    res.status(200).send(response.data);
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Not authenticated";
    res.status(500).json({ message: errorMessage });
  }
}
