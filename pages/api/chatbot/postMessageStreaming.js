// pages/api/stream.js
import axios from 'axios';

export default async (req, res) => {

    const { message,  } = req.body
  try {
    const fastApiUrl = 'http://35.220.164.17:8000/stream';
    const response = await axios.post(fastApiUrl, { message: 'Your message' }, { responseType: 'stream' });

    res.setHeader('Content-Type', 'text/event-stream');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error in /api/stream:', error);
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
};
