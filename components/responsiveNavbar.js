import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import moment from "moment-timezone";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineCloudUpload,
  AiOutlineLogin,
} from "react-icons/ai";

import {
  PiUploadDuotone,
  PiChatTeardropTextDuotone,
  PiUserCircleDuotone,
  PiChatDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

import { FaFileLines, FaGoogleDrive } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/router";
import firstLetterCapitalized from "../utils/stringManimupaltion.js";
import useChatInfoStore from "../stores/chatStore.js";

const tabs = [
  {
    icon: <PiUploadDuotone className="w-4 h-4" />,
    text: "Manage Document",
    link: "/upload",
  },
  {
    icon: <PiChatTeardropTextDuotone className="w-4 h-4" />,
    text: "Conversation",
    link: "/chatbot",
  },
  {
    icon: <PiUserCircleDuotone className="w-4 h-4" />,
    text: "Account",
    link: "/profile",
  },
];

const TabItems = ({
  setSelectedTabIndex,
  selectedTabIndex,
  setShowCreateModal,
}) => {
  return (
    <div>
      <div className="flex justify-center align-middle px-5 pt-4 pb-3">
        <button
          className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0 w-full"
          onClick={() => setShowCreateModal(true)}
        >
          + Upload documents
        </button>
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${
            selectedTabIndex === index
              ? "text-blue-800 text-sm font-medium"
              : ""
          } mx-4 flex py-2 items-center justify-center align-center rounded hover:bg-gray-100 font-medium transition duration-300`}
          onClick={() => setSelectedTabIndex(index)}
        >
          <div className="ml-3 text-sm mr-3">{tab.icon}</div>
          <Link href={tab.link} className="w-full text-sm">
            {tab.text}
          </Link>
        </div>
      ))}
    </div>
  );
};

const CreateContentModal = ({ showModal, setShowCreateModal }) => {
  const fileInput = useRef(null);
  const [filesUpload, setFilesUpload] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(event) {
    setFilesUpload([...event.target.files]);
    console.log("this is files" + filesUpload.name);
    handleFilesUpload([...event.target.files]);
  }

  async function handleFileChoose() {
    fileInput.current.click();
  }

  async function handleFilesUpload(files) {
    setUploadStatus("in-progress");
    console.log("handleFilesUpload " + filesUpload);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "/api/upload/postFilesUpload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(progressEvent);
            console.log(progressEvent);
          },
        }
      );
      if (response.status === 200) {
        setUploadStatus("Completed");
        console.log("upload completed");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      setUploadStatus("failed");

      const errorMessage =
        error.response?.data?.message || "Failed to upload. Please try again.";
      setUploadStatus(errorMessage);

      setUploadProgress(-1);
    }
  }

  return (
    showModal && (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white rounded">
          <div className="p-6 space-y-4 border-b">
            <h1 className="mb-2 text-lg font-semibold text-gray-900">
              Upload new document...
            </h1>
            <p className="text-sm font-normal text-gray-600">
              You can upload document from local device or Google drive
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6 border-b">
            <button
              className="p-4 ring-1 ring-gray-200 rounded-2xl text-left space-y-3 hover:ring-gray-300 active:ring-gray-400"
              onClick={handleFileChoose}
            >
              <div className="flex items-center space-x-3">
                <FaFileLines className="w-4 h-4 text-blue-800" />
                <div className="text-indigo-700 text-base font-semibold">
                  + Upload document
                </div>
              </div>
              <div>Upload your files from local device (.pdf, .png, .html)</div>
              <input
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                style={{ display: "none" }}
                multiple
              ></input>
            </button>
            <button className="p-4 ring-1 ring-gray-200 rounded-2xl text-left space-y-3 hover:ring-gray-300 active:ring-gray-400">
              <div className="flex items-center space-x-3">
                <FaGoogleDrive className="w-4 h-4 text-red-800" />
                <div className="text-red-700 text-base font-semibold">
                  + Google drive
                </div>
              </div>
              <div>Get your files securely from Google drive</div>
            </button>
          </div>
          <div className="flex justify-between p-6">
            <div className="flex-start">{uploadStatus}</div>
            <button
              className="transition-all duration-200 relative font-medium shadow-sm outline-none hover:outline-none focus:outline-none rounded-lg px-4 py-2 text-base bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-2 active:ring-1"
              onClick={() => {
                setShowCreateModal(false), setUploadStatus("");
              }}
            >
              <span className="flex items-center justify-center mx-auto space-x-2 select-none font-semibold">
                Cancel
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  );
};
const handleLogout = () => {
  sessionStorage.setItem("accessToken", "");
};

function Navbar({ accessToken, name }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [token, setToken] = useState("");
  const router = useRouter(); // Get the router object
  const [nameString, setNameString] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const currentChatId = useChatInfoStore((state) => state.currentChatId);
  const setCurrentChatId = useChatInfoStore((state) => state.setCurrentChatId);
  const addChatArray = useChatInfoStore((state) => state.addChatArray);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);

  useEffect(() => {
    //Access Token
    setToken(accessToken);
    //From login page
    setCurrentChatId(sessionStorage.getItem("currentChatId"));
    //Load Chatlist
    getChatList();

    console.log("this is name " + nameString);
    const currentTabIndex = tabs.findIndex(
      (tab) => tab.link === router.pathname
    );
    if (currentTabIndex !== -1) {
      setSelectedTabIndex(currentTabIndex);
    }
  }, [token, router.pathname]);

  const groupedChats = useMemo(() => {
    const today = [];
    const yesterday = [];
    const last7Days = [];
    const last30Days = [];
    
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = moment().tz(userTimeZone).startOf('day');
  
    chatList.forEach((chat) => {
      const chatTime = moment.utc(chat.last_chat_time).tz(userTimeZone).startOf('day');
      const diffDays = now.diff(chatTime, "days");
  
      if (diffDays < 0) return; // Handle chats from the future appropriately
      
      if (diffDays === 0) today.push(chat);
      else if (diffDays === 1) yesterday.push(chat);
      else if (diffDays <= 7) last7Days.push(chat); // If you want to include 'yesterday' in 'last7Days'
      else if (diffDays <= 30) last30Days.push(chat); // If you want to include 'last7Days' in 'last30Days'
    });
  
    return { today, yesterday, last7Days, last30Days };
  }, [chatList]);

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
      await setCurrentChatId(chatId);
      return chatId;
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    }
  }

  async function postDeleteChat(id) {
    try {
      console.log("Function : getNewChatId ", id);
      const response = await axios.post(
        "/api/chatbot/postDeleteChat",
        { chat_id: id },
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );
      setChatArray([]);
      await getChatList();
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    }
  }

  async function getChatMessages(id) {
    try {
      const response = await axios.post(
        "/api/chatbot/getChatMessages",
        { chat_id: id },
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );

      const messages = response.data.messages.split("\n");

      if (messages.length > 1) {
        messages.forEach((message, index) => {
          const isHuman = message.startsWith("human:");
          const messageContent = message.split(": ")[1]; // Extracting message content after ':'

          const messageObject = {
            sender: isHuman ? "me" : "bot",
            message: isHuman ? messageContent : { message: messageContent },
            time: "", // You can fill in the time based on your requirement
          };

          addChatArray(messageObject);
        });
        console.log("Chat History restored", messages);
      }

      await getChatList();
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    }
  }

  async function getChatTitle(id) {
    try {
      console.log("Function : UpdateChatTitle ");
      const response = await axios.get(
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

  async function handleNewConversation() {
    const newChatId = await getNewChatId();
    console.log("New ChatId conversation: ", newChatId);
    setChatArray([]);
    await getChatList();
  }

  async function handleChatClick(id) {
    setChatArray([]);
    console.log("Chat id Clicked: ", id);
    setSelectedChatId(id);
    await getChatMessages(id);
  }

  return (
    <div className="">
      {/* Desktop Navigation */}

      <div className="hidden lg:block relative h-screen overflow-hidden w-64 bg-gray-50 transition-transform transform translate-x-0 transition duration-300 flex flex-col">
        <div className="">
          <div className="flex items-center justify-between h-12 px-4 border-gray-200 hover:bg-gray-100 border-b">
            <div
              className="flex items-center "
              onClick={() => console.log(currentChatId)}
            >
              <div className="bg-green-800 text-xs w-6 h-6 aspect-1 rounded-full font-bold text-white flex items-center justify-center">
                {firstLetterCapitalized(name)}
              </div>
              <div className="text-black-800 truncate ml-2 font-medium">
                {name}
              </div>
            </div>
            <Link href={"/login"} className="text-sm" onClick={handleLogout}>
              <AiOutlineLogin className="text-xl" />
            </Link>
          </div>
        </div>
        <div className="pb-2 flex-0 border-b border-gray-200 mt-2 ">
          <TabItems
            setSelectedTabIndex={setSelectedTabIndex}
            selectedTabIndex={selectedTabIndex}
            setShowCreateModal={setShowCreateModal}
          />
        </div>

        <div className="overflow-hidden flex flex-col">
          <div className="flex justify-center align-middle px-5 pt-4 pb-3">
            <button
              className="transition-all bg-gray-200 duration-200 relative font-semibold  outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm border-gray-600 text-gray-500 ring-0 ring-gray-200 hover:ring-2 active:ring-0 w-full"
              onClick={() => {}}
            >
              <div onClick={handleNewConversation}>New Conversation</div>
            </button>
          </div>
          <div className="text-sm text-gray-600 pl-5 pt-2 font-medium mb-2">
            Chat history
          </div>
          <div className="overflow-y-auto flex-grow">
            {[
              { label: "Today", chats: groupedChats.today },
              { label: "Yesterday", chats: groupedChats.yesterday },
              { label: "Previous 7 Days", chats: groupedChats.last7Days },
              { label: "Previous 30 Days", chats: groupedChats.last30Days },
            ].map(
              (section) =>
                section.chats.length > 0 && (
                  <div
                    className="text-sm text-gray-600 pl-5 pt-2 font-medium mb-2"
                    key={section.label}
                  >
                    <h2>{section.label}</h2>
                    <ul>
                      {section.chats.map((chat) => (
                        <li
                          key={chat.chat_id}
                          onClick={() => handleChatClick(chat.chat_id)}
                          className={
                            selectedChatId === chat.chat_id
                              ? "text-blue-800"
                              : ""
                          }
                        >
                          <Link
                            href={`/chatbot`}
                            className=" flex py-2 px-2 mr-4 items-center justify-center align-center rounded hover:bg-gray-100 transition duration-300"
                          >
                            <PiChatDuotone className="" />

                            {selectedChatId === chat.chat_id ? (
                              <div className="w-full text-sm ml-2 font-normal">
                                {chat.subject}
                              </div>
                            ) : (
                              <div className="w-full text-sm ml-2 font-normal truncate">
                                {chat.subject}
                              </div>
                            )}

                            {selectedChatId === chat.chat_id && (
                              <PiTrashDuotone
                                onClick={() => postDeleteChat(chat.chat_id)}
                                className="ml-2"
                              />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>

          {/* <ul>
              {chatList.map((chat) => (
                <li
                  key={chat.chat_id}
                  onClick={() => handleChatClick(chat.chat_id)}
                  className={
                    selectedChatId === chat.chat_id ? "text-blue-800" : ""
                  }
                >
                  <Link
                    href={`/chatbot`}
                    className="mx-4 flex py-2 px-2 justify-center align-center rounded hover:bg-gray-100 transition duration-300"
                  >
                    <PiChatDuotone className="text-regular" />

                    {selectedChatId === chat.chat_id ? (
                      <div className="w-full text-sm ml-2 font-normal">
                        {chat.subject}
                      </div>
                    ) : (
                      <div className="w-full text-sm ml-2 font-normal truncate">
                        {chat.subject}
                      </div>
                    )}

                    {selectedChatId === chat.chat_id && (
                      <PiTrashDuotone
                        onClick={() => postDeleteChat(chat.chat_id)}
                        className="ml-2"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul> */}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="bg-slate-100 items-center justify-center p-4 relative lg:hidden">
        {drawerOpen && (
          <div
            className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 z-20"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-md z-10 transition-transform transform translate-x-0 transition duration-300 custom:hidden">
              <TabItems
                setSelectedTabIndex={setSelectedTabIndex}
                selectedTabIndex={selectedTabIndex}
                setShowCreateModal={setShowCreateModal}
              />
            </div>
          </div>
        )}

        <div className="float-left">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="mr-4 text-2xl"
          >
            <AiOutlineMenu />
          </button>
        </div>

        <Link className="float-right relative text-2xl" href="/profile">
          <AiOutlineUser />
        </Link>

        <div className="clear-both"></div>
      </div>

      <CreateContentModal
        showModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    </div>
  );
}

export default Navbar;
