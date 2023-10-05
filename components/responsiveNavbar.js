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
  PiPowerDuotone,
  PiTrashDuotone,
  PiCaretUpDuotone,
  PiCaretDownDuotone,
  PiChatDuotone,
} from "react-icons/pi";

import { FaFileLines, FaGoogleDrive } from "react-icons/fa6";
import Spinner from "../components/animation/spinner";
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
    <div className="rounded-lg">
      <div className="flex justify-center align-middle px-5 pt-4 pb-3 ">
        <button
          className="transition-all bg-gray-200 duration-200 relative font-semibold  outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm border-gray-600 text-gray-500 ring-0 ring-gray-200 hover:ring-2 active:ring-0 w-full"
          onClick={() => setShowCreateModal(true)}
        >
          Upload documents
        </button>
      </div>
      <div className="border-b bg-gray-100">
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
      <div
        className="mx-4 flex py-2 items-center justify-center align-center rounded hover:bg-gray-100 font-medium transition duration-300 cursor-pointer"
        onClick={handleLogout}
      >
        <PiPowerDuotone className="ml-3 text-xl mr-3" />
        <Link href={"/login"} className="w-full text-sm">
          Logout
        </Link>
      </div>
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

      const errorMessage ="Completed"
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
  const [isDeleteChatLoading, setisDeleteChatLoading] = useState(false);
  const currentChatId = useChatInfoStore((state) => state.currentChatId);
  const setCurrentChatId = useChatInfoStore((state) => state.setCurrentChatId);
  const addChatArray = useChatInfoStore((state) => state.addChatArray);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);
  

  useEffect(() => {
    //Access Token
    setToken(accessToken);
    //From login page
    
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
    const now = moment().tz(userTimeZone).startOf("day");

    chatList.forEach((chat) => {
      const chatTime = moment
        .utc(chat.last_chat_time)
        .tz(userTimeZone)
        .startOf("day");
      const diffDays = now.diff(chatTime, "days");

      if (diffDays < 0) return; // Handle chats from the future appropriately

      if (diffDays === 0) today.push(chat);
      else if (diffDays === 1) yesterday.push(chat);
      else if (diffDays <= 7) last7Days.push(chat);
      // If you want to include 'yesterday' in 'last7Days'
      else if (diffDays <= 30) last30Days.push(chat); // If you want to include 'last7Days' in 'last30Days'
    });

    return { today, yesterday, last7Days, last30Days };
  }, [chatList]);

  function Navigation() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    return (
      <div className="flex flex-col h-full relative bg-slate-50">
        {isDropdownVisible && (
          <div className="absolute mb-1 bottom-12 rounded-lg m-2 left-0 right-0 mx-auto z-20 pb-1 mt-2 origin-top-right bg-gray-100 focus:outline-none border border-gray-200 translate-y-1 animate-expandFromBottom max-w-[95%]">
          <TabItems
            setSelectedTabIndex={setSelectedTabIndex}
            selectedTabIndex={selectedTabIndex}
            setShowCreateModal={setShowCreateModal}
          />
        </div>
        )}

        <div className="overflow-hidden flex flex-col">
          <div className="flex justify-center align-middle px-5 pt-4 pb-3">
            <button
              className="transition-all duration-200 relative font-semibold shadow-sm outline-none hover:outline-none focus:outline-none rounded-md px-3 py-1.5 text-sm bg-blue-600 text-white ring-0 ring-blue-600 hover:ring-2 active:ring-0 w-full"
              onClick={() => {}}
            >
              <div onClick={handleNewConversation}>+ New Conversation</div>
            </button>
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
                    className="text-sm text-gray-600 px-2 py-1"
                    key={section.label}
                  >
                    <div className="text-xs ml-3 font-semibold text-gray-400">
                      {section.label}
                    </div>
                    <ul>
                      {section.chats.map((chat) => (
                        <li
                          key={chat.chat_id}
                          onClick={() => handleChatClick(chat.chat_id)}
                          className={
                            selectedChatId === chat.chat_id
                              ? "text-blue-800 bg-gray-200 rounded-lg hover:bg-gray-200 relative"
                              : "relative"
                          }
                        >
                          <Link
                            href={`/chatbot`}
                            className="block py-3 px-2 rounded hover:bg-gray-100 transition duration-300 w-full relative"
                          >
                            <div className="flex items-center flex-grow space-x-2 pr-6">
                              <div className="flex-shrink-0">
                                <PiChatDuotone />
                              </div>
                              <div
                                className={
                                  selectedChatId === chat.chat_id
                                    ? "min-w-0 mr-2 typewriter-effect inline-block"
                                    : "min-w-0 mr-2 inline-block"
                                }
                              >
                                <div className="truncate text-ellipsis flex-grow text-caption font-regular">
                                  {chat.subject}
                                </div>
                              </div>
                            </div>
                            {selectedChatId === chat.chat_id && (
                              isDeleteChatLoading ? (
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 pr-2">
                                <Spinner size={`w-5 h-5`}/>
                              </div>) : (
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 pr-2">
                                
                                <PiTrashDuotone
                                  onClick={(e) => {
                                    postDeleteChat(chat.chat_id);
                                  }}
                                />
                              </div>
                              )
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div
            className="flex items-center justify-between h-12 px-4 border-gray-200 bg-slate-100 hover:bg-gray-200 border-b"
            onClick={() => {
              setDropdownVisible(!isDropdownVisible);
              console.log("profile section clicked");
            }}
          >
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
            <div></div>
          </div>
        </div>
      </div>
    );
  }

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

  async function postDeleteChat(id) {
    setisDeleteChatLoading(true);
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
      
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    } finally{
      router.push(`/chatbot`, undefined, { shallow: true });
      setisDeleteChatLoading(false);
    }
   
  }

 

  async function handleNewConversation() {
    const newChatId = await getNewChatId();
    console.log("New ChatId conversation: ", newChatId);
    setChatArray([]);
    router.push(`/chatbot/${newChatId}`, undefined, { shallow: true });
    setSelectedChatId(newChatId)
    await getChatList();
    
  }

  async function handleChatClick(id) {
    setChatArray([]);
    console.log("Chat id Clicked: ", id);
   
    router.push(`/chatbot/${id}`);
    setSelectedChatId(id);
    await getChatList();
  }

  return (
    <div className="">
      {/* Desktop Navigation */}

      <div className="hidden lg:block relative h-screen overflow-hidden w-64 bg-gray-50 transition-transform transform translate-x-0 transition duration-300 flex flex-col">
        <Navigation />
      </div>

      {/* Mobile Navigation */}
      <div className="bg-slate-100 items-center justify-center p-4 relative lg:hidden">
        {drawerOpen && (
          <div
            className="fixed h-full w-[180px] inset-0 bg-black bg-white flex z-10"
            style={{ width: "180px" }}
          >
            <Navigation setDrawerOpen={drawerOpen} />
            {/* Close Button */}
            <button 
                className="self-start p-4 z-10 text-xl" 
                onClick={() => setDrawerOpen(false)}
            >
                <AiOutlineClose />
            </button>
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
