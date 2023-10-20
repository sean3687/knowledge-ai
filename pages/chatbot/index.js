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

  const [expandedIndex, setExpandedIndex] = useState(-1);

  const toggleItemExpansion = (index) => {
    if (expandedIndex === index) {
      // If the same item is clicked again, close it
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  };
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl text-center">
        <div className="text-5xl font-bold text-gray-600">Welcome to K-LIB</div>

        <div className="text-lg mt-4">
          Introducing K-LIB, our AI chatbot! Upload documents for detailed
          analysis, seamlessly retrieve them through conversations, harness the
          power of ChatGPT for web searches, and watch as it crafts responses
          using your uploaded documents.
        </div>
        <div className="flex w-full justify-center">
          {keyFeature.map((item, index) => (
            <div
              className="flex flex-row items-center justify-center mt-8 mx-5"
              key={index}
            >
              <div
                className={`cursor-pointer transform hover:scale-110 transition-transform ${
                  expandedIndex === index ? "text-2xl" : ""
                }`}
                onClick={() => toggleItemExpansion(index)}
              >
                {
                  expandedIndex === index
                    ? item.text // Render text when expanded
                    : item.icon // Render icon when not expanded
                }
              </div>
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mt-8">Instructions</div>
        <div className="mt-2">
          1. Click{" "}
          <Link href={"/upload"} className="">
            <strong className="text-blue-500">Manage Documents</strong>
          </Link>{" "}
          to upload your files.
        </div>
        <div className="mt-2">
          2. Wait as K-LIB meticulously analyzes your documents.
        </div>
        <div className="mt-2">
          3. Click <strong className="text-blue-500">+ New Chat</strong> button
          to start a conversation.
        </div>
        <div className="mt-2">
          4. Engage with K-LIB and explore the possibilities!
        </div>
      </div>
    </div>
  );
}

export default withLayout(Chat, "dashboard");
