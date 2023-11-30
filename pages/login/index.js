import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import useAccountInfoStore from "../../stores/store";
import withLayout from "../../components/layouts/withLayout";
import LottieAnimation from "../../components/animation/lottie-animation";
import accountingLottie from "../../public/accounting-lottie.json";
import { toast, Toaster } from "react-hot-toast";
import Spinner from "../../components/animation/spinner";
import { useSessionStorage } from "../../hooks/useSessionStorage";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken2, setAccessToken] = useSessionStorage('accessToken', '');
  const [username, setUsername] = useSessionStorage('name', '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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

      toast.success("Successfully Login!");

      let accessToken= response.data.accessToken;
      setAccessToken(response.data.accessToken);
      console.log("This is accessToken" + accessToken2);
      await getProfile(accessToken);
      window.location.href = "/chatbot";
      setIsLoading(false);

    } catch (error) {
      if (!setIsLoading) {
        // For other errors (status code 500), display a generic error message.
        toast.error("Please Try Again Later");
      }
      if (error.response && error.response.status === 401) {
        // If the status code is 404, display a specific error message for incorrect ID or password.
        toast.error("ID or Password is incorrect");
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
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
      console.log("did you get username from getRPfoeil? 2" + response.data.response.username);
        setUsername(response.data.response.username);
        setTimeout(() => {
          
        }, 2000);
    } else {
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-skyblue-300 ">
      {/* Left Side Content */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex-1 flex flex-col items-center justify-center p-10 md:px-30 bg-blue-600">
        <div className="absolute top-1 left-6 text-white text-xl font-bold p-6">
          KLIB
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white w-full text-center mt-40">
          Unlock Your Documents&apos; Potential with AI
        </h1>
        <p className="text-gray-200 mb-4 text-center">
          Upload your documents and let KLIB&apos;s leading AI extract vital
          insights, enhancing your data experience. Experience the future of the
          knowledge library today!
        </p>
        <LottieAnimation
          animationData={accountingLottie}
          width={500}
          height={500}
        />
      </div>

      {/* Right Side Content */}
      <div className="flex-1 flex p-6 md:p-5">
        <div className="bg-white p-4 w-full lg:mt-40 md:p-8 md:min-w-[400px] ">
          <h2 className="text-2xl md:text-3xl font-bold  mb-10">
            Login to KLIB
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
            <div className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-5">
              <button
                className="w-full text-white font-bold py-2 px-4 rounded flex justify-center items-center"
                type="submit"
              >
                {isLoading ? (
                  <dib className="flex items-center">
                    <Spinner
                      className=""
                      size={`w-6 h-6`}
                      tintColor={"fill-white"}
                      bgColor={"dark:text-blue-300"}
                    />
                    <div className="ml-2">Logging in...</div>
                  </dib>
                ) : (
                  "Log In"
                )}
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
