import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Loading from "../animation/loading";
import { FaPaperPlane, FaTrashCan, FaRegComments } from "react-icons/fa6";
import {
  PiUserDuotone,
  PiBrainDuotone,
  PiArrowDown,
  PiFolderUserDuotone,
  PiGlobeSimpleDuotone,
  PiDownloadSimpleDuotone,
  PiQueueDuotone,
  PiMagnifyingGlassDuotone,
  PiGoogleLogoDuotone,
} from "react-icons/pi";
import hljs from "highlight.js";
import "highlight.js/styles/panda-syntax-dark.css"; // choose a style of your preference
import axios from "axios";
import Spinner from "../animation/spinner";
import LoadingDots from "../animation/loadingDots";
import formatDate from "../../utils/dateFormat";
import LottieAnimation from "../animation/lottie-animation";
import documentlottie from "../../public/document-loading.json";
import linkify from "../../utils/linkify.js";
import { useSessionStorage } from "../../hooks/useSessionStorage";

function ChatController({
  inputText,
  isSendChatLoading,
  isGetChatLoading,
  streamingResponse,
  messages,
  setInputText,
  handleClick,
  responseStatus,
  handleRefresh,
}) {
  const router = useRouter();
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [expandedSummarizeRow, setExpandedSummarizeRow] = useState(null);
  const [expandedBlock, setExpandedBlock] = useState({
    blockId: null,
    index: null,
  }); // Add this state
  const [summaryData, setSummaryData] = useState(null);
  const { docId } = router.query;
  const [accessToken, setAccessToken] = useSessionStorage("accessToken", "");
  const Instruction = [
    {
      title: "Casual Conversation",
      text: "Tell me a random fun fact about the Roman Empire.",
    },
    {
      title: "Chat with your Documents",
      text: "From my files, [your custom query]",
    },
    {
      title: "Retrieve Specific Documents",
      text: "Find me documents related to [Your Specific Detail]",
    },
    {
      title: "On-the-Spot Info Fetch",
      text: "What is the weather today in Irvine, CA?",
    },
  ];

  const renderBasedOnResponseStatus = (status) => {
    console.log("renderBasedOnResponseStatus", status);
    switch (status[0]) {
      case "ChatGPT":
        return (
          <div className="border border-purple-500/75 border-1 flex rounded-lg justify-center items-center max-w-fit">
            <div className="flex">
              <PiGlobeSimpleDuotone className="w-6 h-6 mx-4 my-2 text-purple-500" />
            </div>
            <div className="my-2 mr-5">
              <div className="flex items-center">
                <div className="text-gray text-xs font-bold flex aligns-center">
                  <span className="mr-2">Browsing...</span>
                </div>
                <Spinner
                  className=""
                  size={`w-3 h-3`}
                  tintColor={"fill-black"}
                  bgColor={"dark:text-purple-300"}
                />
              </div>
              <div className="text-gray text-xs font-medium mr-2">
                {responseStatus[0]}
              </div>
            </div>
          </div>
        );
      case "Google_Search":
        return(
        <div className="border border-red-500/75 border-1 flex rounded-lg justify-center items-center max-w-fit">
          <div className="flex">
            <PiGoogleLogoDuotone className="w-6 h-6 mx-4 my-2 text-red-500" />
          </div>
          <div className="my-2 mr-5">
            <div className="flex items-center">
              <div className="text-gray text-xs font-bold flex aligns-center">
                <span className="mr-2">Browsing...</span>
              </div>
              <Spinner
                className=""
                size={`w-3 h-3`}
                tintColor={"fill-black"}
                bgColor={"dark:text-red-300"}
              />
            </div>
            <div className="text-gray text-xs font-medium mr-2">
              {responseStatus[0]}
            </div>
          </div>
        </div>
        )
      case "Document_QA_System":
        return (
          <div className="border border-blue-500/75 border-1 flex rounded-lg justify-center items-center max-w-fit">
            <div className="flex">
              <PiFolderUserDuotone className="w-6 h-6 mx-4 my-2 text-blue-500" />
            </div>
            <div className="my-2 mr-5">
              <div className="flex items-center">
                <div className="text-gray text-xs font-bold flex aligns-center">
                  <span className="mr-2">Browsing...</span>
                </div>
                <Spinner
                  className=""
                  size={`w-3 h-3`}
                  tintColor={"fill-black"}
                  bgColor={"dark:text-blue-300"}
                />
              </div>
              <div className="text-gray text-xs font-medium mr-2">
                Your documents
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-4">
            <LoadingDots />
          </div>
        );
    }
  };

  const renderBasedOnSource = (sourceStatus) => {
    switch (sourceStatus) {
      case "ChatGPT":
        return (
          <div className="flex rounded-lg justify-center items-center max-w-fit bg-white rounded-md">
            <div className="flex">
              <PiGlobeSimpleDuotone className="w-6 h-6 mx-4 my-2 text-purple-500" />
            </div>
            <div className="my-2 mr-5">
              <div className="flex items-center">
                <div className="text-gray text-xs font-bold flex aligns-center">
                  <span className="mr-2">ChatGPT</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "Google_Search":
        return (
          <div className="flex rounded-lg justify-center items-center max-w-fit bg-white rounded-md">
            <div className="flex">
              <PiGoogleLogoDuotone className="w-6 h-6 mx-4 my-2 text-red-500" />
            </div>
            <div className="my-2 mr-5">
              <div className="flex items-center">
                <div className="text-gray text-xs font-bold flex aligns-center">
                  <span className="mr-2">Google Search</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "Document_QA_System":
        return (
          <div className="flex rounded-lg justify-center items-center max-w-fit">
            <div className="flex">
              <PiFolderUserDuotone className="w-6 h-6 mx-4 my-2 text-blue-500" />
            </div>
            <div className="my-2 mr-5">
              <div className="flex items-center">
                <div className="text-gray text-xs font-bold flex aligns-center">
                  <span className="mr-2">Document Library</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "Document_Display":
        return (
          <div className="flex rounded-lg justify-center items-center max-w-fit">
            <div className="flex">
              <PiMagnifyingGlassDuotone className="w-6 h-6 mx-4 my-2 text-blue-500" />
            </div>
            <div className="my-2 mr-5">
              <div className="flex items-center">
                <div className="text-gray text-xs font-bold flex aligns-center">
                  <span className="mr-2">Document Search</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };
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
            Authorization: `Bearer ${accessToken}`,
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

  function markdownToHtml(str) {
    // Convert bold text
    str = str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert code blocks with syntax highlighting
    str = str.replace(/```(.*?)\n(.*?)```/gs, function (match, lang, code) {
      const highlightedCode = hljs.highlight(lang, code).value;
      return `<pre><code class="hljs ${lang}">${highlightedCode}</code></pre>`;
    });

    str = linkify(str);

    return str;
  }

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
      } else {
        event.preventDefault();
        handleClick();
      }
    }
  };

  const downloadDocumentClick = (fileId) => {
    getDownloadDocument(fileId);
  };

  async function getDownloadDocument(id) {
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
          responseType: "arraybuffer", // Ensure the response type is arraybuffer
        }
      );
      // Convert the arraybuffer to a blob with the appropriate content type
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobURL = URL.createObjectURL(blob);

      // Open the blob URL in a new tab
      window.open(blobURL, "_blank");

      if (response.status === 200) {
        console.log("Document Opened");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function summarizeDocumentClick(blockId, fileId, index) {
    console.log("this is blockId", blockId);
    console.log("this is fileId", fileId);

    setSummaryLoading(true);
    setSummaryData("");

    // Check if the clicked block is already expanded
    if (expandedBlock.blockId === blockId) {
      setExpandedBlock({ blockId: null, index: null }); // Collapse the expanded block
    } else {
      setExpandedBlock({ blockId: blockId, index: index }); // Set the clicked block as the expanded block

      const data = await getSummary(fileId);
      setSummaryData(data);
    }

    setSummaryLoading(false);
  }

  const getSummary = async (id) => {
    const selectedId = id;

    try {
      const response = await axios.get(
        `/api/chatbot/getSummary/?selectedId=${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const summary = await response.data.message;
      console.log("this is summary ", summary);
      return summary;
    } catch (err) {
      console.log(err);
      return "Error occured during summary. Please Try again.";
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
        {messages.length == 0 && !isGetChatLoading && !docId ? (
          <div className="flex justify-center items-center font-bold text-9xl mt-20 text-[#cccfef8c]">
            <FaRegComments />
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="p-6"></div>
            <div className="border-t border-gray-300"></div>
            <div className="justify-center">
              {messages?.map((item, blockId) => {
                let displayMessage = item.message;

                return item.sender == "human" ? (
                  <div className="border-b">
                    <div className="m-auto max-w-3xl p-5">
                      <div className="bg-white flex" key={blockId}>
                        <div className="text-white">
                          <PiUserDuotone className="text-4xl fill-current bg-blue-400 rounded p-1" />
                        </div>
                        <div className="ml-5">
                          {displayMessage}
                          <div>
                            <time className="text-xs opacity-50">
                              {formatDate(item.timestamp)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-b bg-gray-50 ">
                    <div className="m-auto max-w-3xl p-5">
                      <div className="flex" key={blockId}>
                        <div className="text-white">
                          <PiBrainDuotone className="text-4xl fill-current bg-blue-600 rounded p-1" />
                        </div>
                        <div className="ml-5 w-full">
                          <div
                            style={{ whiteSpace: "pre-line" }}
                            dangerouslySetInnerHTML={{
                              __html: markdownToHtml(item.message),
                            }}
                          ></div>

                          {item.sender === "ai" &&
                          (item.source === "Document_QA_System" ||
                            item.source === "Document_Display") ? (
                            <div className="bg-white p-2 rounded-md my-2">
                              <div className="">
                                {renderBasedOnSource(item.source)}
                              </div>
                              <div className="flex text-xs mt-2 items-center w-full">
                                <table className="min-w-full divide-y divide-gray-200 outline outline-1 outline-gray-200 rounded-md">
                                  <thead>
                                    <tr>
                                      <th className="px-4 py-2">Filename</th>
                                      <th className="px-4 py-2 ">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.relevant_files &&
                                      item.relevant_files.map((item, index) => (
                                        <React.Fragment key={index}>
                                          <tr key={index}>
                                            <td className="px-4 py-2">
                                              {item.file_name}
                                            </td>
                                            <td className="flex px-4 py-2 items-center justify-center">
                                              <button
                                                onClick={() =>
                                                  downloadDocumentClick(
                                                    item.file_id
                                                  )
                                                }
                                                className="relative transform transition-transform hover:scale-105 active:scale-95 px-2"
                                              >
                                                <div className="relative group">
                                                  <PiDownloadSimpleDuotone />
                                                </div>
                                              </button>
                                              <button
                                                onClick={() =>
                                                  summarizeDocumentClick(
                                                    blockId,
                                                    item.file_id,
                                                    index
                                                  )
                                                }
                                                className="px-2"
                                              >
                                                <div className="relative group">
                                                  <PiQueueDuotone />
                                                </div>
                                              </button>
                                            </td>
                                          </tr>
                                          {expandedBlock.blockId === blockId &&
                                            expandedBlock.index === index && (
                                              <tr>
                                                <td
                                                  colSpan="2"
                                                  className="px-4 py-2"
                                                >
                                                  {/* Display the summary data here */}
                                                  {summaryData}
                                                </td>
                                              </tr>
                                            )}
                                        </React.Fragment>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : item.sender === "ai" &&
                            (item.source === "ChatGPT" ||
                              item.source === "Google_Search") ? (
                            <>
                              <div className="">
                                {renderBasedOnSource(item.source)}
                              </div>

                              <div className="flex text-xs items-center">
                                {(item.relevant_files &&
                                  item.relevant_files.length > 0) ||
                                (item.relevant_files &&
                                  item.relevant_files.length > 0) ? (
                                  <span className="text-sm font-bold mr-2">
                                    Learn more:
                                  </span>
                                ) : null}
                                <div className="flex flex-wrap items-center">
                                  {item.relevant_files &&
                                    item.relevant_files.length > 0 &&
                                    item.relevant_files.map((data, index) => (
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
                            </>
                          ) : (
                            <></>
                          )}
                          <div>
                            <time className="text-xs opacity-50">
                              {formatDate(item.timestamp)}
                            </time>
                          </div>
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
                  <div
                    className="chat-bubble chat-bubble-primary ml-5"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    <div>
                      <div className="max-width-[150px] mb-2">
                        {renderBasedOnResponseStatus(responseStatus)}
                      </div>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(streamingResponse),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Bottom Floating Area part */}
      <div
        className="lg:w-[calc(100%-256px)] w-full flex opacity-bottom-0 absolute bottom-0 px-4 items-center flex-col"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0), rgba(220, 220, 220,1))",
        }}
      >
        {messages.length === 0 && !isGetChatLoading && !docId ? (
          //Instruction

          <div className="mb-5 relative w-full">
            <div className=" grid grid-cols-2 gap-4 align-center mt-10 justify-center max-w-5xl  m-auto">
              {Instruction.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl border-gray-300 p-5 text-xs hover:bg-gray-200"
                  onClick={handleHandleInstruction(item.text)}
                >
                  <div className="font-bold text-gray-700">{item.title}</div>
                  <div className="text-gray-400">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        ) : !isGetChatLoading ? (
          //Scroll to bottom button
          <button
            className="relative mb-5 font-semibold shadow-sm rounded-full px-3 py-3 text-white ring-0 outline-none border-0 h-full opacity-75 bg-blue-600 mb-2 w-10 ml-auto mr-5"
            onClick={scrollToBottom}
          >
            <PiArrowDown />
          </button>
        ) : (
          //document loading animation
          <LottieAnimation
            animationData={documentlottie}
            width={300}
            height={300}
            className="mb-5"
          />
        )}

        <div className="mx-4 mb-5 flex flex-col w-full @sm:pb-5 max-w-5xl m-auto">
          {/* Textarea/Input Box */}
          <div className="border rounded-lg ">
            <div className="">
              <textarea
                rows="1"
                style={{
                  "maxHeight?": "400px",
                  height: "56px",
                }}
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
                    "transition-all duration-200 relative font-semibold rounded-md px-3 py-1.5 text-sm text-white ring-blue-600 active:ring-0 ring-0 hover:ring-0 outline-none hover:outline-none focus:outline-none border-0 h-full opacity-75" +
                    (isSendChatLoading
                      ? " opacity-40 text-white "
                      : " bg-blue-600 text-white")
                  }
                  onClick={handleClick}
                >
                  {isSendChatLoading ? (
                    <LoadingDots className="text-black px-1 py-2" />
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
