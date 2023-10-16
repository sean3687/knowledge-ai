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
  const [responseStatus, setResponseStatus] = useState("");
  const [fileObject, setFileObject] = useState();
  const [inputText, setInputText] = useState("");
  const [streamingResponse, setStreamingResponse] = useState("");
  const chatArray = useChatInfoStore((state) => state.chatArray);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);
  const addChatArray = useChatInfoStore((state) => state.addChatArray);
  const popChatArray = useChatInfoStore((state) => state.popChatArray);
  const router = useRouter();
  const chatId = router.query.id;

  useEffect(() => {
    const savedChatId = sessionStorage.getItem("current_chatId");
    console.log("Chatid From Session Storage", savedChatId);
    console.log("chatid from router", chatId);

    if (savedChatId !== chatId) {
      setChatArray([]);
      getChatMessages(chatId);
      sessionStorage.setItem("current_chatId", chatId);
    }

    let intervalId;

    if (isSendChatLoading) {
      intervalId = setInterval(async () => {
        if (chatId) {
          await getChatStatus(chatId);
          console.log("this is response status", responseStatus);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [chatId, isSendChatLoading]);

  const sendMessageClick = async () => {
    setIsSendChatLoading(true);
    console.log("In progress: sendMessageClick1 ", isSendChatLoading);
    setStreamingResponse("");
    const currentInputText = inputText;
    setInputText("");

    let chatId = router.query.id;

    if (!chatId) {
      console.log("ChatId not found");
      await setNewChatId();

      chatId = router.query.id;
    }

    if (chatId) {
      sendMessageGivenChatId(currentInputText);
    }
  };

  const sendMessageGivenChatId = async (messageText) => {
    let chatId = router.query.id;
    console.log("In progress: sendMessageGivenChatId");
    const sendTime = moment().format("h:mm");
    const myMessage = { sender: "me", message: messageText, time: sendTime };
    addChatArray(myMessage);

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

      let isDispDetected = false;
      let accumulatedResponse = "";

      reader.read().then(async function process({ done, value }) {
        if (done) {
          let fileData;
          if (isDispDetected) {
            fileData = await displayRelevantFile(
              chatId,
              inputText,
              accumulatedResponse
            );
          } else {
            fileData = await getRelevantFile(
              chatId,
              inputText,
              accumulatedResponse
            );
          }

          const finalBotMessage = {
            sender: "bot",
            message: accumulatedResponse,
            time: sendTime,
            fileData: fileData,
          };

          getChatTitle(chatId);
          console.log("this is finalBot Message", finalBotMessage);
          addChatArray(finalBotMessage);
          setIsSendChatLoading(false);
          setStreamingResponse("");
          return;
        }

        let decodedValue = new TextDecoder("utf-8").decode(value);

        // Check for "disp:" only if not already detected
        console.log("this is devoded value", decodedValue);
        if (!isDispDetected && decodedValue.startsWith("disp: ")) {
          let dispValues = decodedValue.split("disp: ")[1];
          dispValues = dispValues.replace(/\n\n$/, '');
          accumulatedResponse = accumulatedResponse + dispValues;
          isDispDetected = true;
          return reader.read().then(process); // Skip further processing for this chunk and continue reading
        }

        let processedValues = decodedValue.split("data: ");

        for (let val of processedValues) {
          console.log("this is val", val);
          if (val.endsWith("\n\n")) {
            val = val.slice(0, -2); // Remove the ending newline characters
          }
          accumulatedResponse = accumulatedResponse + val;
        }

        setStreamingResponse(accumulatedResponse);

        return reader.read().then(process); // Continue processing the stream
      });
    } catch (error) {
      popChatArray();
      setStreamingResponse("");
      const errorMessage = {
        sender: "bot",
        message: "Sorry, something went wrong. Please try again.",
        time: sendTime,
      };
      addChatArray(errorMessage); // Add error message to chat array
      console.error("Fetch Error:", error);
    }
  };

  async function getChatStatus(chatId) {
    try {
      const response = await axios.get(
        `/api/chatbot/getChatStatus?chat_id=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );
      const chatStatus = response.data;
      setResponseStatus(chatStatus);
      return;
    } catch (error) {
      setResponseStatus("");
      return "";
    }
  }

  async function displayRelevantFile(chatId, inputText, aiResponse) {
    const body = {
      chat_id: chatId,
      human_message: inputText,
      ai_message: aiResponse,
    };
    try {
      const response = await axios.post(
        "/api/chatbot/getDisplayRelevantFile",
        body,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const releventFile = response.data;
        console.log("Relevent file is : ", releventFile);
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
        console.log("Relevent file is : ", releventFile);
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
      // router.push(`/chatbot/${chatId}`, undefined, { shallow: true });

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
        // getRelevantFile={fileObject}
        responseStatus={responseStatus}
        setInputText={setInputText}
        handleClick={sendMessageClick}
        handleRefresh={handleRefresh}
      />
    </div>
  );
}

export default Controller;
