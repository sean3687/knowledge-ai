import { AiOutlineSend, AiOutlineRobot, AiOutlineUser } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Loading from "./animation/loading";
import ScrollButton from "./scrollBottom";
import { FaPaperPlane, FaTrashCan, FaRegComments } from "react-icons/fa6";
import { PiBrainDuotone, PiArrowDown } from "react-icons/pi";
import { icons } from "react-icons";
import axios from "axios";

function ChatController({
  inputText,
  isSendChatLoading,
  isGetChatLoading,
  streamingResponse,
  messages,
  setInputText,
  handleClick,
  handleRefresh,
}) {
  const router = useRouter();
  const { docId } = router.query;
  const Instruction = [
    {
      title: "Weather Forecast",
      text: "Can you show me the weather forecast for today in Irvine?",
    },
    {
      title: "Document Retrieval",
      text: "Please retrieve and provide a summary of the [ your-document ] document.",
    },
    {
      title: "Category Retrieval",
      text: "Find me documents in our database fall under the 'Receipt' category",
    },
    {
      title: "Document Summarization",
      text: "Can you summarize the main points from the [ your-document ] for me?",
    },
];
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleHandleInstruction = (itemText) => () => {
    setInputText(itemText);
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  async function getDownloadDocument(id) {
    console.log("this is id", id);
    if (!id) return;

    console.log("this is download document id" + id);
    try {
      const response = await axios.post(
        `/api/upload/getDownloadDocument`,
        { selectedId: id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobURL = URL.createObjectURL(blob);

      window.open(blobURL, "_blank");

      if (response.status === 200) {
        console.log("Document Opened");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
      } else {
        event.preventDefault();
        handleClick();
        scrollToBottom()
      }
    }
  };

  useEffect(() => {
    scrollToBottom;
  }, [messages]);

  return (
    <div className="w-full">
      <div
        className={
          messages.length == 0 && !docId ? "w-full mb-0" : " w-full mb-40"
        }
      >
        {/* Conversation */}
        {console.log(messages)}
        {messages.length == 0 && !isGetChatLoading && !docId ? (
          <div className="h-screen mb-0">
            <div className="flex justify-center items-center font-bold text-8xl pt-10 text-[#cccfef8c]">
              <FaRegComments />
            </div>

            <div className="grid grid-cols-2 gap-4 align-center mt-20 justify-center  p-10">
              {Instruction.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-5 text-xs hover:bg-gray-200"
                  onClick={handleHandleInstruction(item.text)}
                >
                  <div className="font-bold text-gray-700">{item.title}</div>
                  <div className="text-gray-400">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="p-6"></div>
            <div className="border-t border-gray-300"></div>
            <div className="justify-center">
              {messages?.map((item, key) => {
                let displayMessage = item.message;

                return item.sender == "me" ? (
                  <div className="border-b">
                    <div className="m-auto max-w-3xl p-5">
                      <div className="bg-white flex" key={key}>
                        <div className="text-white">
                          <AiOutlineUser className="text-4xl fill-current bg-blue-400 rounded p-1" />
                        </div>
                        <div className="ml-5">
                          {displayMessage}
                          <div>
                            <time className="text-xs opacity-50">
                              {item.time}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-b bg-gray-50 ">
                    <div className="m-auto max-w-3xl p-5">
                      <div className=" flex" key={key}>
                        <div className="text-white">
                          <PiBrainDuotone className="text-4xl fill-current bg-blue-600 rounded p-1" />
                        </div>
                        <div className="ml-5">
                          {item.message}
                          <div>
                            <time className="text-xs opacity-50">
                              {item.time}
                            </time>
                          </div>
                          {item.sender === "bot" &&
                            item.fileData &&
                            item.fileData.length > 0 && (
                              <div className="flex text-xs items-center">
                                <span className="text-sm font-bold mr-2">
                                  Learn more:
                                </span>
                                <div className="flex flex-wrap items-center">
                                  {" "}
                                  {item.fileData.map((data, index) => (
                                    <button
                                      key={index}
                                      className="relative transform transition-transform px-1 mr-1 max-w-[130px] "
                                      onClick={() => {
                                        getDownloadDocument(data.file_id);
                                      }}
                                    >
                                      <div className="relative group text-xs bg-blue-500 px-2 py-1 rounded-lg text-white truncate max-w-[130px] hover:max-w-full">
                                        {data.file_name}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className=" border-gray-300"></div>
            </div>
          </div>
        )}
        <div>
          {isSendChatLoading ? (
            <div className="border-b bg-gray-50">
              <div className="m-auto max-w-3xl">
              <div className=" bg-gray-50 p-5 flex ">
              
                <div className="text-white">
                  <PiBrainDuotone className="text-4xl fill-current bg-orange-600 rounded p-1" />
                </div>
                <div className="chat-bubble chat-bubble-primary ml-5">
                  {streamingResponse}
                  <div className="chat-bubble items-center chat-bubble-primary mt-3">
                    <Loading />
                  </div>
                </div>
              </div>
              
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        className="lg:w-[calc(100%-256px)] w-full flex opacity-bottom-0 absolute bottom-0 px-4 items-center flex-col"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0), rgba(220, 220, 220,1))",
        }}
      >
        {messages.length !== 0 ? (
          <button
            className="relative mb-5 font-semibold shadow-sm rounded-full px-3 py-3 text-white ring-0 outline-none border-0 h-full opacity-75 bg-blue-600 mb-2 w-10 ml-auto mr-5"
            onClick={scrollToBottom}
          >
            <PiArrowDown />
          </button>
        ) : (
          <></>
        )}

        <div className="mx-4 mb-5 flex flex-col w-full @sm:pb-5 max-w-7xl m-auto">
          {/* Textarea/Input Box */}
          <div className="border rounded-lg">
            <div className="">
              <textarea
                rows="4"
                style={{ height: "45px", "overflow-y": "hidden" }}
                className="block w-full text-gray-900 placeholder:text-gray-400 text-base font-normal resize-none outline-none px-4 py-4 rounded-t-lg focus:outline-none border-none bg-white z-5"
                placeholder={
                  isSendChatLoading
                    ? "Wait a second...."
                    : "Type your message..."
                }
                value={inputText}
                disabled={isSendChatLoading}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
              />
            </div>
            <div className="flex gap-2 justify-between p-2.5 bg-white border-b rounded-b-lg">
              {/* Clear Button */}

              <div className="flex-shrink-0 h-full px-2 py-1">
                <button
                  className="transition-all duration-200 relative font-semibold shadow-sm rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-blue-600 active:ring-0 ring-0 hover:ring-0 outline-none hover:outline-none focus:outline-none border-0 h-full opacity-75"
                  onClick={handleRefresh}
                >
                  <FaTrashCan className="text-xl mx-1" />
                </button>
              </div>
              {/* Submit Button */}
              <div className="flex-shrink-0 h-full px-2 py-1 flex">
                <div className="flex items-center gap-2 mr-2">
                  <span className="ml-auto text-xs text-gray-500 transition-[color] duration-150 ease-in-out">
                    {inputText.length}/6000
                  </span>
                </div>
                <button
                  className={
                    "transition-all duration-200 relative font-semibold shadow-sm rounded-md px-3 py-1.5 text-sm text-white ring-blue-600 active:ring-0 ring-0 hover:ring-0 outline-none hover:outline-none focus:outline-none border-0 h-full opacity-75" +
                    (isSendChatLoading
                      ? " opacity-40 text-white "
                      : " bg-blue-600 text-white")
                  }
                  onClick={handleClick}
                >
                  {isSendChatLoading ? (
                    <Loading className="px-1 py-2" />
                  ) : (
                    <FaPaperPlane className="text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatController;
