import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import moment from "moment-timezone";
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser } from "react-icons/ai";

import {
  PiChatTeardropTextDuotone,
  PiUserCircleDuotone,
  PiPowerDuotone,
  PiTrashDuotone,
  PiFolderUserDuotone,
  PiChatDuotone,
} from "react-icons/pi";

import { FaFileLines, FaGoogleDrive } from "react-icons/fa6";
import Spinner from "../animation/spinner";
import axios from "axios";
import { useRouter } from "next/router";
import firstLetterCapitalized from "../../utils/stringManimupaltion.js";
import useChatInfoStore from "../../stores/chatStore.js";
import extractUsername from "../../utils/usernameExtracter";
import { useSessionStorage } from "../../hooks/useSessionStorage.js";

const tabs = [
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

const TabItems = ({ setSelectedTabIndex, selectedTabIndex }) => {
  return (
    <div className="rounded-lg">
      <div className="border-b bg-white mt-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`${
              selectedTabIndex === index
                ? "text-blue-800 text-sm font-medium"
                : ""
            } mx-2 flex py-2 items-center justify-center align-center rounded hover:bg-gray-100 font-medium transition duration-300`}
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
        className="mx-2 flex py-2 items-center justify-center align-center rounded hover:bg-gray-100 font-medium transition duration-300 cursor-pointer"
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

const handleLogout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("name");
};

function ResponsiveNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const router = useRouter(); // Get the router object
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isDeleteChatLoading, setisDeleteChatLoading] = useState(false);
  const currentChatId = useChatInfoStore((state) => state.currentChatId);
  const setChatArray = useChatInfoStore((state) => state.setChatArray);
  const [username, setUsername] = useSessionStorage("name", "");
  const [accessToken] = useSessionStorage("accessToken", "");
  const [selectedChat, setSelectedChat] = useSessionStorage("selectedChat", "");
  const [firstLetter, setFirstLetter] = useState("");
  const [usernameExtracted, setUsernameExtracted] = useState("");
  
  useEffect(() => {
    getChatList();
    setFirstLetter(firstLetterCapitalized(username));
    setUsernameExtracted(extractUsername(username));
  }, []);

  useEffect(() => {
    console.log("Updated username:", username);
  }, [username]);

  useEffect(() => {
    const currentTabIndex = tabs.findIndex(
      (tab) => tab.link === router.pathname
    );
    if (currentTabIndex !== -1) {
      setSelectedTabIndex(currentTabIndex);
    }
  }, [router.pathname]);

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
      <div className="flex flex-col h-full relative bg-slate-100 shadow-md">
        {isDropdownVisible && (
          <div className="absolute mb-1 bottom-12 rounded-lg m-2 left-0 right-0 mx-auto z-20 pb-1 mt-2 origin-top-right bg-white focus:outline-none border border-gray-200 translate-y-1 animate-expandFromBottom max-w-[95%]">
            <TabItems
              setSelectedTabIndex={setSelectedTabIndex}
              selectedTabIndex={selectedTabIndex}
            />
          </div>
        )}

        <div className="overflow-hidden flex flex-col">
          <div className="justify-center align-middle px-4 pt-4 pb-3 border-b w-full">
            <button
              className="mx-auto p-4 py-3 ring-1 ring-gray-300 rounded-xl text-left space-y-4 hover:ring-gray-300 active:ring-gray-400 min-w-fit-content w-full"
              onClick={() => {}}
            >
              <Link
                href={"/upload"}
                className="w-full text-sm items-center flex"
              >
                <PiFolderUserDuotone className="text-xl mr-2" />
                <div className="font-bold"> Manage Document</div>
              </Link>
            </button>
          </div>
          <div className="w-full flex justify-center mb-2">
            <button
              className="w-full max-w-xs mx-4 mt-2 font-semibold text-sm py-2
              bg-blue-600 text-white shadow-sm rounded-md ring-0 ring-blue-600 hover:ring-2 active:ring-0
              transition-all duration-200 outline-none hover:outline-none focus:outline-none"
              onClick={() => {}}
            >
              <div onClick={handleNewConversation}>+ New Chat</div>
            </button>
          </div>

          <div className="overflow-y-auto flex-grow ">
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
                            href={`/chatbot/${chat.chat_id}`}
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
                            {selectedChatId === chat.chat_id &&
                              (isDeleteChatLoading ? (
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 pr-2">
                                  <Spinner size={`w-5 h-5`} />
                                </div>
                              ) : (
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 pr-2">
                                  <PiTrashDuotone
                                    onClick={(e) => {
                                      postDeleteChat(chat.chat_id);
                                    }}
                                  />
                                </div>
                              ))}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>

        <div className="mt-auto border-t">
          <div
            className="flex items-center justify-between h-12 px-4 border-gray-200 bg-white hover:bg-gray-200 border-b"
            onClick={() => {
              setDropdownVisible(!isDropdownVisible);
              console.log("profile section clicked");
            }}
          >
            <div
              className="flex items-center"
              onClick={() => console.log(currentChatId)}
            >
              <div className="bg-green-800 text-xs w-6 h-6 aspect-1 rounded-full font-bold text-white flex items-center justify-center">
                {firstLetter}
              </div>
              <div className="text-black-800 truncate ml-2 font-medium">
                {usernameExtracted}
              </div>
            </div>
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
            accessToken
          }`,
        },
      });
      console.log("chatlist response :", response.data);
      setChatList(response.data);
    } catch (error) {
      console.error("Error getting new chat ID", error);
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
              accessToken || ""
            }`,
          },
        }
      );
      setChatArray([]);
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return -1;
    } finally {
      router.push(`/chatbot`, undefined, { shallow: true });
      setisDeleteChatLoading(false);
    }
  }

  async function getNewChatId() {
    try {
      console.log("Function : getNewChatId ");
      const response = await axios.get("/api/chatbot/postCreateNewChat", {
        headers: {
          Authorization: `Bearer ${
            accessToken
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
    setChatArray([]);
    router.push(`/chatbot/${newChatId}`, undefined, { shallow: true });
    setSelectedChatId(newChatId);
    await getChatList();
  }

  async function handleChatClick(id) {
    console.log("Chat id Clicked: ", id);
    router.push(`/chatbot/${id}`);
    setSelectedChatId(id);
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
          <div className="fixed h-full inset-0 bg-black flex z-10 max-w-[100px]">
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
    </div>
  );
}

export default ResponsiveNavbar;
