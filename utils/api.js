import axios from "axios";

// const { token, setToken } = useContext(TokenContext);
const API_BASE_URL = "http://http://54.193.180.218:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (un, pw) => {
  console.log("this is log from util " + un);

  try {
    // await axios.post(
    //   "http://http://54.193.180.218:8000/token",
    //   { 'username': un, 'password':pw },
    //   { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    // ).then(function(response){
    //     const accessToken = response.data.access_token;
    // console.log("access Token Ready " + accessToken);
    // // sessionStorage.setItem('accessToken', accessToken);
    // })
    
    
    // return accessToken;
  } catch (error) {
    console.error("error message: " + error);
    return error;
  }


};

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
