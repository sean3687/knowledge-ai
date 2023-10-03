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
  const streamingResponseRef = useRef("");
  const isApiCallInProgress = useRef(false);

  useEffect(() => {
    if (!isApiCallInProgress.current) {
      isApiCallInProgress.current = true;
    }
  }, []);

  const sendMessageClick = async () => {
    setIsLoading(true);
    setStreamingResponse(""); // Clear previous streaming response
    setInputText("");

    let chatId = currentChatId;
    if (!chatId) {
      chatId = await setNewChatId();
    }

    const sendTime = moment().format("h:mm");
    const myMessage = { sender: "me", message: inputText, time: sendTime };
    addChatArray(myMessage);

    try {
        const response = await fetch(
            `https://chitchatrabbit.me/chain/${chatId}/${encodeURIComponent(inputText)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            }
        );

        if (!response.body)
            throw Error("ReadableStream not yet supported in this browser.");
        console.log("This is debug input text", inputText);
        const reader = response.body.getReader();

        let accumulatedResponse = ""; // Declare a variable to accumulate the response

        reader.read().then(function process({ done, value }) {
            if (done) {
                const cleanedMessage = accumulatedResponse.replace(/\n\n/g, " ").trim();
                const finalBotMessage = {
                    sender: "bot",
                    message: cleanedMessage,
                    time: sendTime,
                };
                addChatArray(finalBotMessage);
                console.log("Final bot message added: ", finalBotMessage); // For Debugging
                setIsLoading(false);
                setStreamingResponse("");
                return;
            }

            let decodedValue = new TextDecoder("utf-8").decode(value);
            let processedValue = decodedValue.split("data: ").join("");
            
            accumulatedResponse += processedValue; // Add to the accumulated response
            setStreamingResponse(accumulatedResponse);
            console.log("This is newest streaming response", accumulatedResponse);
            
            return reader.read().then(process); // Continue processing the stream
        });
    } catch (error) {
        popChatArray(); // Remove bot loading message from chat array in case of error
        setStreamingResponse("");
        const errorMessage = {
            sender: "bot",
            message: error.message,
            time: sendTime,
        };
        addChatArray(errorMessage); // Add error message to chat array
        console.error("Fetch Error:", error);
    }
};

  async function getChantMessages() {
    try {
      const response = await axios.get("/api/chatbot/getChatMessages", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const messages = response.data.messages;
        setChatArray(messages);
      }
    } catch (error) {
      console.error("Error getting chat messages", error);
    }
  }

  async function getRelevantFile() {
    try {
    } catch (error) {}
  }

  async function setNewChatId() {
    try {
      console.log("chatid Not found running setNewChatId");
      const response = await axios.get("/api/chatbot/postCreateNewChat", {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem("accessToken") || ""
          }`,
        },
      });
      const chatId = response.data.chat_id;
      sessionStorage.setItem("current_chatId", chatId);
      setCurrentChatId(chatId);

      return chatId;
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return;
    }
  }

  async function getChatTitle(id) {
    try {
      console.log("Function : UpdateChatTitle ");
      const response = await axios.post(
        "/api/chatbot/getChatTitle",
        { chat_id: id },
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );
      console.log("Function : UpdateChatTitle -> success");
      //refresh chat list should be implemented
    } catch (error) {
      console.error("Function : UpdateChatTitle -> failed", error);
    }
  }

  const handleRefresh = async () => {
    const response = await axios.get("/api/chatbot/getClearChatHistory", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      alert("Successfully clear history");
      setChatArray([]);
    } else {
      alert("failed to clear history");
    }
  };

  return (
    <div className="w-full lg:h-[calc(100%-258px)]">
      <ChatController
        inputText={inputText}
        isLoading={isLoading}
        streamingResponse={streamingResponse}
        messages={chatArray}
        setInputText={setInputText}
        handleClick={sendMessageClick}
        handleRefresh={handleRefresh}
      />
    </div>
  );
}

export default Controller;
