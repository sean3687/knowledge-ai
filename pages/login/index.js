import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import useAccountInfoStore from "../../stores/store";
import withLayout from "../../components/layouts/withLayout";
import LottieAnimation from "../../components/animation/lottie-animation";
import animationData from "../../public/accounting-lottie.json";


function LoginPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log("this is username" + username);
    console.log("this is password" + password);
    try {
      const response = await axios.post("/api/login/postLogin", {
        username: username,
        password: password,
      });

      //set Login Sucess Message
      setMessage(response.data.message);
      //set access token on session storage
      const accessToken = response.data.accessToken;
      sessionStorage.setItem("accessToken", accessToken);
      console.log("getprofile here");
      //load profile
      await getProfile(accessToken);
      //create new chat id and set
      console.log("move to login page" );
      window.location.href = "/chatbot";
      console.log("move finished" +chatid);
    } catch (error) {
      // setMessage(error.response.data.message);
    }
  };

  async function getProfile(accessToken) {
    const response = await axios.get("/api/getProfile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("did you get username from getRPfoeil?" + username);
    if (response.data.success) {
      sessionStorage.setItem("name", response.data.response.username);
    } else {
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-skyblue-300 ">
      {/* Left Side Content */}

      <div className="flex-1 flex flex-col items-center justify-center p-10 md:px-30 bg-blue-600">
        <div className="absolute top-1 left-6 text-white text-xl font-bold p-6">
          Knowledge AI
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white w-full text-center mt-40">
          Empower Your Documents with AI
        </h1>
        <p className="text-gray-200 mb-4 text-center">
          Upload your documents and let our AI analyze them. We&lsquo;ll find
          the right documents for you, provide valuable accounting information,
          and more.
        </p>
        <LottieAnimation
          animationData={animationData}
          width={500}
          height={500}
        />
      </div>

      {/* Right Side Content */}
      <div className="flex-1 flex p-6 md:p-5">
        <div className="bg-white p-4 w-full lg:mt-40 md:p-8 md:min-w-[400px] ">
          <h2 className="text-2xl md:text-3xl font-bold  mb-10">
            Login to KnowledgeAI
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-500 text-normal font-medium mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full p-4 text-lg border rounded-lg outline-none focus:ring-1"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-gray-500 text-normal font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-1" // Increased padding and removed focus ring here
                required
              />
            </div>
            {message && <p className="text-xs text-red-500 mb-3">{message}</p>}
            <div className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-10">
              <button
                className="w-full text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mt-4 text-normal text-gray-600">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="text-blue-500 font-medium hover:underline ml-1"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/5"></div>
    </div>
  );
}
export default withLayout(LoginPage, "login");
