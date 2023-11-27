import axios from "axios";

// const { token, setToken } = useContext(TokenContext);
const API_BASE_URL = "http://https://chitchatrabbit.me";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const checkUserAPI = async ( accessToken) => {

}

export const callChainApi = async (access_token, message) => {
  const response = await api.post(
    "/chain",
    { "message" : message },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};
