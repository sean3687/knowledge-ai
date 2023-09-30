import { AiOutlineSend, AiOutlineRobot, AiOutlineUser } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Loading from "./animation/loading";
import ScrollButton from "./scrollBottom";
import { FaPaperPlane, FaTrashCan, FaRegComments } from "react-icons/fa6";
import { icons } from "react-icons";

function ChatController({
  inputText,
  isLoading,
  messages,
  setInputText,
  handleClick,
  handleRefresh,
}) {
  const router = useRouter();
  const { docId } = router.query;
  const Instruction = [
    {
      title: "Access Documents",
      text: "Please show me and provide a summary of the July 2023 Bicat Report.",
    },
    {
      title: "Expense Tracking",
      text: "what are my income and expenses for Q1 2023?",
    },
    {
      title: "Tax-Preparation",
      text: "Can you provide me financial statements, to send to my CPA for 2022 tax filing?",
    },
    {
      title: "Investment Basics",
      text: "what is our household's total net worth at the end of 2022?",
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

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        
      } else {
        event.preventDefault(); 
        handleClick(); 
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
        {messages.length == 0 && !docId ? (
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
            <div className="">
              {messages?.map((item, key) => {
                let displayMessage = item.message;
                let displayFileId = -1;
                let displayFileName = "Not Available";

                if (item.sender === "bot") {
                  displayMessage = item.message.message;
                  displayFileId = item.message.file_id;
                  displayFileName = item.message.file_name || "Not Available";
                }

                return item.sender == "me" ? (
                  <>
                    <div className="bg-white px-20 py-5 flex" key={key}>
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
                    <div className="border-t border-gray-300"></div>
                  </>
                ) : item.sender == "bot-loading" && isLoading ? (
                  <>
                    <div className=" bg-gray-50 px-20 py-5  flex " key={key}>
                      <div className="text-white">
                        <AiOutlineRobot className="text-4xl fill-current bg-indigo-600 rounded p-1" />
                      </div>
                      <div className="chat-bubble chat-bubble-primary ml-5">
                        {item.message}
                        <div>
                          <time className="text-xs opacity-50">
                            {item.time}
                          </time>
                        </div>
                        <div className="chat-bubble items-center chat-bubble-primary">
                          <Loading />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-300"></div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 px-20 py-5 flex" key={key}>
                      <div className="text-white">
                        <AiOutlineRobot className="text-4xl fill-current bg-indigo-600 rounded p-1" />
                      </div>
                      <div className="ml-5">
                        {displayMessage}

                        <div>
                          <time className="text-xs opacity-50">
                            {item.time}
                          </time>
                        </div>
                        <div className="flex text-xs ">
                          {displayFileId > -1 && (
                            <div className="text-sm font-bold flex items-center justify-center">
                              Learn more :
                              <div className="bg-indigo-600 bg-opacity-25 text-indigo-600 ml-2 rounded">
                                <div className="text-opacity-100 px-2 py-1 ">
                                  {displayFileName}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-300"></div>
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div
        className="lg:w-[calc(100%-256px)] w-full flex opacity-bottom-0 absolute bottom-0 px-4 items-center"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0), rgba(220, 220, 220,1))",
        }}
      >
        <div className="mx-4 mb-5 flex flex-col w-full @sm:pb-5 max-w-7xl m-auto border rounded-lg">
          {/* Textarea/Input Box */}
          <div className="">
            <textarea
              rows="4"
              style={{ height: "45px", "overflow-y": "hidden" }}
              className="block w-full text-gray-900 placeholder:text-gray-400 text-base font-normal resize-none outline-none px-4 py-4 rounded-t-lg focus:outline-none border-none bg-white"
              placeholder={
                isLoading ? "Wait a second...." : "Type your message..."
              }
              value={inputText}
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
                  (isLoading
                    ? " opacity-40 text-white "
                    : " bg-blue-600 text-white")
                }
                onClick={handleClick}
              >
                {isLoading ? (
                  <Loading className="px-1 py-2" />
                ) : (
                  <FaPaperPlane className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatController;
