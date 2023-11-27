import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthNotFound from "../../components/authNotfound";
import useAccountInfoStore from "../../stores/store";
import withLayout from "../../components/layouts/withLayout";
import { Toaster, toast } from "react-hot-toast";

function ProfilePage({ accessToken, name }) {
  const [message, setMessage] = useState("Show Info");
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const setUsername = useAccountInfoStore((state) => state.setUsername);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState("");

  useEffect(() => {
    setToken(sessionStorage.getItem("accessToken"));
  }, [token]);

  useEffect(() => {
    let interval;
    if (isVerified && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVerified, timer]);

  async function getProfile() {
    const response = await axios.get("/api/getProfile", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    setUserInfo(response.data);

    if (response.data.success) {
      setMessage(response.data.message);
      setUserInfo(response.data.response);
      setUsername(response.data.response.username);
    } else {
      setMessage(response.data.message);
    }
  }
  async function handleKey(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const openai_key = formData.get("openai_key");
    const serp_key = formData.get("serp_key");

    console.log("this is openai_key" + openai_key);
    console.log("this is serp_key" + serp_key);

    const bodyRequest = {
      openai_key: openai_key,
      serp_key: serp_key,
    };
    try {
      const response = await axios.post(
        "https://chitchatrabbit.me/set_api",
        bodyRequest,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserInfo(response.data);
      console.log("api key has been updated ", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handleNewPassword = (e) => {
    e.preventDefault();
    // handle the form submission
  };

  const handleVerify = async () => {
    setIsVerified(true);
    try {
      const response = await axios.post("/api/account/postResetPasswordEmail", {
        username: name,
      });
      console.log("this is response", response);
      if (response.data.success) {
        toast.success("Verification code has been sent to your email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    }
  };

  const handleResend = () => {
    setCanResend(false);
    setTimer(30);
    // Resend the verification code
    handleVerify();
  };

  const handleSubmitResetPassword = async () => {
    try {
      const response = await axios.post("/api/account/postResetPassword", {
        reset_code: verificationCode,
        new_password: password,
      });
      console.log("this is response", response);
      if (response.data.success) {
        toast.success("Successfully updated password");

        // Reset the password and verificationCode states
        setPassword("");
        setVerificationCode("");
        setIsVerified(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    }
  };

  const handleDeleteAccount = async () => {
    setShowModal(true);
    
  };

  const handleConfirmDelete = async() => {
    if (emailConfirmation === name) {
      // API call or method to delete the account
      // After successful deletion, hide the modal
      
      setEmailConfirmation("");
      await deleteAccount();
      setShowModal(false);
    } else {
      toast.error("Email does not match");
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.get("/api/account/getDeleteUser", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("this is response", response);
      if (response.data.success) {
        toast.success("Account has been deleted");
        window.location.href = "/login";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    }
  };

  return token && token.length > 0 ? (
    <div className="py-8 px-10 bg-slate-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-5 rounded-lg">
        <div className="text-lg font-bold p-2">Account inforomation</div>
        {userInfo && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(userInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center space-x-2 overflow-hidden truncate"
                >
                  <p className="text-gray-500 font-semibold">{key}:</p>
                  <p className="text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={getProfile}
        >
          {message}
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg mt-5">
        <div className="text-lg font-bold p-2 ">Change Password</div>
        <form onSubmit={handleNewPassword} className="p-2">
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              New Password:
            </label>
            <input
              type="text"
              id="newPassword"
              name="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-skyblue-200"
              disabled={isVerified}
              required
            />
          </div>
          {isVerified && (
            <div className="mb-4" style={{ display: "inline-block" }}>
              <label
                htmlFor="verification_code"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Verification Code:
              </label>
              <input
                type="text"
                id="verification_code"
                name="verification_code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring focus:ring-skyblue-200"
                required
              />
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`ml-2 font-bold py-2 px-4 rounded ${
                  canResend
                    ? "bg-blue-500 hover:bg-blue-700 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-white"
                }`}
                type="button"
              >
                Resend {canResend ? "" : `(${timer}s)`}
              </button>
            </div>
          )}
          <button
            onClick={handleVerify}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            style={{ display: isVerified ? "none" : "block" }}
          >
            Send Verification Code
          </button>
          {isVerified && (
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              type="submit"
              onClick={handleSubmitResetPassword}
            >
              Update Change
            </button>
          )}
        </form>
      </div>
      <div className="bg-white p-5 rounded-lg mt-5">
        {/* ... All the other components from before ... */}

        <div className="mt-2">
          <div className="text-lg font-bold p-2 text-red-600">Danger Zone</div>
          <div className="p-2">
            <p className="text-sm text-gray-600">
              Warning: These actions are irreversible. Proceed with caution.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            {/* The semi-transparent background */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* The actual modal */}
            <div className="inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Are you sure you want to delete the account?
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This action cannot be undone. To confirm, please enter
                      your email address.
                    </p>
                  </div>
                  <div className="mt-4">
                    <input
                      type="email"
                      value={emailConfirmation}
                      onChange={(e) => setEmailConfirmation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-skyblue-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <AuthNotFound />
  );
}

export default withLayout(ProfilePage, "dashboard");
