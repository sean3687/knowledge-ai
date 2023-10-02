import axios from "axios";

export default async function handler(req, res) {
    //receive chat_id from reqb
    const { chat_id } = req.body;
    //get token from req.headers.authorization
    const token = req.headers.authorization.split(" ")[1];
    //return stream text from chitchatrabbit.me
    
}