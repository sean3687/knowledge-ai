import { useState, useEffect, useRef } from "react";
import FileController from "./fileController.js";
import ChatController from "./chatController.js";
import moment from "moment";
import { useRouter } from "next/router";
import axios from "axios";
import useChatInfoStore from "../stores/chatStore.js";

function Controller() {
  // const [inputText, setInputText] = useState("");
  const [isSendChatLoading, setIsSendChatLoading] = useState(false);
  const [isGetChatLoading, setIsGetChatLoading] = useState(false);
  const [fileObject, setFileObject] = useState();

  // State to hold user input
  const [inputText, setInputText] = useState("");

  // State to hold streaming response
  const [streamingResponse, setStreamingResponse] = useState("");

  const chatArray = useChatInfoStore((state) => state.chatArray);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);
  const addChatArray = useChatInfoStore((state) => state.addChatArray);
  const popChatArray = useChatInfoStore((state) => state.popChatArray);
  const router = useRouter();
  const chatId = router.query.id;

  useEffect(() => {
    if (chatId) {
      // Fetch messages or perform some other action when chatId changes
      getChatMessages(chatId);
    }
  }, [chatId]);

  const sendMessageClick = async () => {
    setIsSendChatLoading(true);
    setStreamingResponse(""); // Clear previous streaming response
    
    const currentInputText = inputText; // Capture the value before clearing
    setInputText("");
  
    let chatId = router.query.id;
  
    if (!chatId) {
      console.log("ChatId not found");
      await setNewChatId();
      chatId = router.query.id; // Assume setNewChatId updates router.query.id synchronously
    }
  
    // Only proceed if you have a chatId
    if (chatId) {
      await sendMessageGivenChatId(chatId, currentInputText);
    }
  };

  const sendMessageGivenChatId  = async () => {

    const sendTime = moment().format("h:mm");
    const myMessage = { sender: "me", message: inputText, time: sendTime };
    addChatArray(myMessage); // Add user message to chat array
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
      
      if (!response.body)
        throw Error("ReadableStream not yet supported in this browser.");
      console.log("This is debug input text", inputText);
      const reader = response.body.getReader();

      let accumulatedResponse = ""; // Declare a variable to accumulate the response
      
      reader.read().then(function process({ done, value }) {
        if (done) {
          
          const aiResponse = accumulatedResponse.replace(/\n\n/g, " ").trim();
          const finalBotMessage = {
            sender: "bot",
            message: aiResponse,
            time: sendTime,
          };
          addChatArray(finalBotMessage);
          getRelevantFile(chatId, inputText, aiResponse);
          getChatTitle(chatId);
          setIsSendChatLoading(false);
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

  async function getRelevantFile(chatId, inputText, aiResponse) {
    const body = {
      chat_id: chatId,
      human_message: inputText,
      ai_message: aiResponse,
    };
    try {
      const response = await axios.post("/api/chatbot/getRelevantFile", body, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const releventFile = response.data;
        setFileObject(releventFile);
        return releventFile;
      }
    } catch (error) {
      return setFileObject({
        file_id: -1,
        file_name: "No relevant file found",
      });
    }
  }

  async function getChatMessages(id) {
    setIsGetChatLoading(true);
    try {
      const response = await axios.post(
        "/api/chatbot/getChatMessage",
        { chat_id: id },
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );

      const messages = response.data;
      setChatArray(messages);

      await getChatList();
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    } finally {
      setIsGetChatLoading(false);
    }
  }

  async function setNewChatId() {
    //when first time open the chatbot
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
      router.push(`/chatbot/${chatId}`, undefined, { shallow: true });

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
      //refresh
    } catch (error) {
      console.error("Error getting new chat ID", error);
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
        isSendChatLoading={isSendChatLoading}
        isGetChatLoading={isGetChatLoading}
        streamingResponse={streamingResponse}
        messages={chatArray}
        getRelevantFile={fileObject}
        setInputText={setInputText}
        handleClick={sendMessageClick}
        handleRefresh={handleRefresh}
      />
    </div>
  );
}

export default Controller;
