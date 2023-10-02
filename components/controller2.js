import { useState, useEffect, useRef } from "react";
import FileController from "./fileController.js";
import ChatController from "./chatController.js";
import moment from "moment";
import { useRouter } from "next/router";
import axios from "axios";
import useChatInfoStore from "../stores/chatStore.js";

function Controller() {
  // const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const router = useRouter();

  // const [chatArray, setChatArray] = useState([]);

  // State to hold user input
  const [inputText, setInputText] = useState("");

  // State to hold streaming response
  const [streamingResponse, setStreamingResponse] = useState("");

  const chatArray = useChatInfoStore((state) => state.chatArray);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);
  const addChatArray = useChatInfoStore((state) => state.addChatArray);
  const popChatArray = useChatInfoStore((state) => state.popChatArray);
  const currentChatId = useChatInfoStore((state) => state.currentChatId);
  const setCurrentChatId = useChatInfoStore((state) => state.setCurrentChatId);

  const setSummarizeId = useChatInfoStore((state) => state.setSummarizeId);

  const isApiCallInProgress = useRef(false);

  useEffect(() => {
    if (!isApiCallInProgress.current) {
      isApiCallInProgress.current = true;
    }
  }, []);

  const sendMessageClick = async () => {
    setStreamingResponse(""); // Clear previous streaming response
    let chatId = currentChatId;
    if (!chatId) {
      chatId = await setNewChatId();
    }

    const sendTime = new Date().toISOString();
    setChatArray([
      ...chatArray,
      { sender: "me", message: inputText, time: sendTime }, // Add user message to chat array
    ]);

    try {
      const response = await fetch(
        `https://chitchatrabbit.me/chain/${chatId}/${encodeURIComponent(
          inputText
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.body) {
        throw Error("ReadableStream not yet supported in this browser.");
      }

      const reader = response.body.getReader();

      let stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              setStreamingResponse(
                (prev) => prev + new TextDecoder("utf-8").decode(value)
              );
              push();
            });
          }
          push();
        },
      });
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    let chatId = currentChatId;
    if (!chatId) {
      chatId = await setNewChatId();
    }

    const sendTime = moment().format("h:mm");
    const myMessage = { sender: "me", message: inputText, time: sendTime };
    const botLoadingMessage = {
      sender: "bot-loading",
      message: "",
      time: sendTime,
    };

    addChatArray(myMessage);
    addChatArray(botLoadingMessage);
    setInputText("");

    const data = {
      chat_id: chatId,
      message: inputText,
    };

    console.log("About to make Axios call");
    try {
      const response = await axios.post("/api/chatbot/postBotMessage", data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        timeout: 180000,
      });
      console.log("Axios call completed");
      popChatArray();

      console.log("title update is updating");

      console.log("title update is finsihed");
      if (response.status === 200) {
        const botMessage = response.data;
        console.log("this is bot controller " + botMessage);
        addChatArray(botMessage);
      } else if (response.status === 401) {
        window.alert("Please login first");
      } else if (response.status === 400) {
        window.alert(response.data.detail);
      }
      await getChatTitle(chatId);
    } catch (error) {
      popChatArray();
      if (
        error.code === "ECONNABORTED" &&
        error.message.indexOf("timeout") !== -1
      ) {
        const timeoutMessage = {
          sender: "bot",
          message: {
            message: "The request took too long! Please try again later.",
          },
          time: sendTime,
        };
        addChatArray(timeoutMessage);
      } else {
        const errorMessage = {
          sender: "bot",
          message: { message: error.message },
          time: sendTime,
        };
        addChatArray(errorMessage);
      }
      console.error(error);
    }

    setIsLoading(false);
  };


  return (
    <div className="w-full lg:h-[calc(100%-258px)]">
      <ChatController
        inputText={inputText}
        isLoading={isLoading}
        messages={chatArray}
        setInputText={setInputText}
        handleClick={sendMessageClick}
        handleRefresh={handleRefresh}
      />
      <div>Stream: {streamingResponse}</div>
    </div>
  );
}

export default Controller;