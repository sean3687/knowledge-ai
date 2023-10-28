import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import {toast, Toaster} from "react-hot-toast";
import { useRouter } from 'next/router';

export default function VerificationPending() {
  const router = useRouter();
  const username = router.query.username;
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [buttonLabel, setButtonLabel] = useState("Send Verification");
 

  const sendVerificationEmail = async (username) => {
    const url = `/api/login/getVerification?username=${username}`;

    setSecondsLeft(30);
    setButtonLabel("Resend in 30s");

    try {
      const response = await axios.get(
        url,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
        toast.error("Please try again");
    }
  };

  useEffect(() => {
    let timer;

    if (secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && buttonLabel !== "Resend Verification") {
      setButtonLabel("Resend Verification");
    }

    return () => clearTimeout(timer); // Clean up timer when component is unmounted
  }, [secondsLeft]);

  return (
    <>
      <Head>
        <title>Email Verification Pending</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">{/* Add an icon here */}</div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Please Check your email to verify your account
          </h1>
          <p className="text-gray-600 mt-2">
            To finish signing up, please click the verification link sent to
            your email
          </p>
          <div className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-5">
            <button
              className="w-full text-white font-bold py-2 px-4 rounded flex justify-center items-center"
              onClick={() => sendVerificationEmail(username)}
              disabled={secondsLeft > 0}
            >
              {secondsLeft > 0
                ? `${buttonLabel} (${secondsLeft}s)`
                : buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
