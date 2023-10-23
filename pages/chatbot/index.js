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
import { useRouter } from "next/router";
import useChatInfoStore from "../../stores/chatStore";

function Chat() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);
  const router = useRouter(); // Get the router object
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

  async function getChatList() {
    try {
      console.log("Function :getChatList");
      const response = await axios.get("/api/chatbot/getChatList", {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem("accessToken") || ""
          }`,
        },
      });
      console.log("chatlist response :", response.data);
      setChatList(response.data);
    } catch (error) {
      console.error("Error getting new chat ID", error);
    }
  }

  async function getNewChatId() {
    try {
      console.log("Function : getNewChatId ");
      const response = await axios.get("/api/chatbot/postCreateNewChat", {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem("accessToken") || ""
          }`,
        },
      });
      const chatId = response.data.chat_id;

      return chatId;
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    }
  }

  async function handleNewConversation() {
    const newChatId = await getNewChatId();
    console.log("New ChatId conversation: ", newChatId);
    setSelectedChatId(newChatId);
    setChatArray([]);
    setTimeout(() => {
      router.push(`/chatbot/${newChatId}`, undefined, { shallow: true });
    }, 2000);
    
    
    
  }


  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl text-center">
        <div className="text-5xl font-bold text-gray-600">
          Welcome to KLIB🌟
        </div>
        <div className="mx-4">
          <div className="text-left">
            <div className="text-2xl font-bold mt-8">
            Meet KLIB: Your Custom LLM-Powered AI Companion! 🤖
            </div>
            <div className="mt-2">
              ✅ Upload documents for in-depth insights.
            </div>
            <div className="mt-2">✅ Easily retrieve them during conversations.</div>
            <div className="mt-2">
              ✅ Leverage ChatGPT for precise web searches.
            </div>
            <div className="mt-2">
              ✅ Experience tailored responses using your uploaded content.
            </div>
            <div className="mt-2">
              Jump in and let KLIB enhance your interaction 🚀
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
