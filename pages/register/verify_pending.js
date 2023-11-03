import axios from "axios";
import { PiArrowRight } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import React, { createRef } from 'react';
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import maskEmail from "../../utils/maskemail";

export default function VerificationPending() {
  const router = useRouter();
  const username = router.query.username;
  const [secondsLeft, setSecondsLeft] = useState(-1);
  const [buttonLabel, setButtonLabel] = useState("Send Verification");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const otpRefsContainer = useRef(Array(6).fill(null));

  useEffect(() => {
    otpRefsContainer.current = otp.map((_, index) => otpRefsContainer.current[index] ?? createRef());
  }, []);

  const handleVerify = async () => {
    verifyVerificationCode(otp);
  };

  const verifyVerificationCode = async (otp) => {
    const otpString = otp.join("");
    const url = `/api/login/getVerifyVerificationCode?otp=${otpString}`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.href = "/login";
      } else {
        toast.error(response.data.message || "Verification failed.");
      }
    } catch (error) {
      toast.error("Please try again");
    }
  };
  const sendVerificationEmail = async () => {
    const url = `/api/login/getVerification?username=${router.query.username}`;

    setSecondsLeft(30);
    setButtonLabel("Resend in 30s");

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Please try again");
    }
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;

    if (value.length <= 1) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;

        return newOtp;
      });

      if (value && otpRefs[index + 1]) {
        otpRefs[index + 1].current.focus(); // Move focus to the next input
      }
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
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col justify-center items-center">
        <div className="text-center mb-4">{/* Add an icon here */}</div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          Verification Required
        </h1>
        <p className="text-gray-400 mt-2 mb-2 font-bold">
          Enter the code we&apos;ve emailed to you
        </p>
        <p className="text-gray-400 mt-2 mb-2 font-bold">
          {maskEmail(username)}
        </p>
        <div className="flex justify-between mt-4 mb-4 w-full">
          {otp.map((num, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              className="w-10 h-20 text-center  bg-gray-100  font-bold rounded focus:border-blue-600 focus:outline-none"
              value={num}
              ref={otpRefsContainer.current[idx]}
              onChange={(e) => handleOTPChange(e, idx)}
            />
          ))}
        </div>
        <button
          className="bg-blue-500 text-white font-bold p-4 rounded-full mt-2 hover:bg-blue-600 focus:outline-none"
          onClick={handleVerify}
        >
          <PiArrowRight className="text-4xl" />
        </button>
        <button
          className="text-blue-500 mt-2 hover:underline focus:outline-none"
          onClick={sendVerificationEmail}
        >
          Resend{secondsLeft > 0 ? ` in ${secondsLeft}s` : ""}
        </button>
      </div>
    </div>
  );
}
