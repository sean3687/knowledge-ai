import Controller from "../../components/controller";
import {} from "react-icons/ai";
import { useState } from "react";
import withLayout from "../../components/layouts/withLayout";
import Link from "next/link";
import {
  PiUserDuotone,
  PiBrainDuotone,
  PiArrowDown,
  PiFolderUserDuotone,
  PiGlobeSimpleDuotone,
} from "react-icons/pi";

function Chat() {
  const keyFeature = [
    {
      icon: (
        <PiFolderUserDuotone className="text-6xl text-white  p-2 rounded-lg bg-blue-500" />
      ),
      text: (
        <div className="flex items-center bg-blue-500 rounded-lg">
          <PiFolderUserDuotone className="text-6xl text-white p-2 rounded-lg" />
          <div className="text-xl text-white font-semibold mr-2">
            Explore documents
          </div>
        </div>
      ),
    },
    {
      icon: (
        <PiGlobeSimpleDuotone className="text-6xl text-white p-2 rounded-lg bg-indigo-500 " />
      ),
      text: (
        <div className="flex items-center bg-indigo-500 rounded-lg">
          <PiGlobeSimpleDuotone className="text-6xl text-white p-2 rounded-lg" />
          <div className="text-xl text-white font-semibold mr-2">
            Web search
          </div>
        </div>
      ),
    },
    {
      icon: (
        <PiBrainDuotone className="text-6xl text-white p-2 rounded-lg bg-blue-500" />
      ),
      text: (
        <div className="flex items-center bg-blue-500 rounded-lg">
          <PiBrainDuotone className="text-6xl text-white p-2 rounded-lg" />
          <div className="text-xl text-white font-semibold mr-2">
            AI-Chatbot
          </div>
        </div>
      ),
    },
  ];


  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl text-center">
        <div className="text-5xl font-bold text-gray-600">
          Welcome to KLIB🌟
        </div>
        <div className="mx-4">
          <div className="text-left">
            <div className="text-2xl font-bold mt-8">
              Meet KLIB: Your AI-powered chat companion! 🤖
            </div>
            <div className="mt-2">
              ✅ Upload documents for in-depth insights.
            </div>
            <div className="mt-2">✅ Effortlessly fetch them during chats.</div>
            <div className="mt-2">
              ✅ Leverage ChatGPT for precise web searches.
            </div>
            <div className="mt-2">
              ✅ Experience tailored responses using your uploaded content.
            </div>
            <div className="mt-2">
              Jump in and let KLIB elevate your chat experience! 🚀
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold mt-8 ">How to Get Started:</div>
            <div className="mt-2">
              1. 📤{" "}
              <Link href={"/upload"} className="">
                <strong className="text-blue-500">Manage Documents</strong>
              </Link>{" "}
              to upload your files.
            </div>
            <div className="mt-2">
              2. 🕐 Hold tight! KLIB is diving deep into your documents.
            </div>
            <div className="mt-2">
              3. Tab <strong className="text-blue-500">+ New Chat</strong> to
              spark a conversation.
            </div>
            <div className="mt-2">
              4. 🌟 Dive in with KLIB and uncover endless possibilities!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withLayout(Chat, "dashboard");
