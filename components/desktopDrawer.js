import {
    AiOutlineMenu,
    AiOutlineClose,
    AiOutlineUser,
    AiOutlineCloudUpload,
    AiOutlineLogin
  } from "react-icons/ai";
  import {
    BsChat
  } from "react-icons/bs"
import React, {useState} from 'react'
import Link from "next/link";

const DesktopDrawer = () => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  
    const tabs = [
      {
        icon: <AiOutlineCloudUpload className="text-xl" />,
        text: "Upload Documents",
        link: "/upload",
      },
      {
        icon: <BsChat className="text-xl" />,
        text: "Chatbot",
        link: "/chatbot",
      },
      {
        icon: <AiOutlineUser className="text-xl" />,
        text: "Account",
        link: "/profile",
      },
      {
        icon: <AiOutlineLogin className="text-xl" />,
        text: "Login",
        link: "/login",
      }
    ];
  return (
    <div className="relative h-screen overflow-y-hidden w-64 bg-white shadow-md z-10 transition-transform transform translate-x-0 transition duration-300">
      <div className="w-full bg-gradient-to-r from-[#542ee6] to-[#2a8ce6] h-40">
      </div>
      <div className="overflow-y-auto">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${
            selectedTabIndex === index ? "bg-blue-500 text-white" : ""
          } flex items-center justify-center align-center font-medium p-3 rounded-lg hover:bg-blue-200 transition duration-300 m-2`}
          onClick={() => {
            setSelectedTabIndex(index);
          }}
        >
          <div className="ml-3 text-sm mr-3">{tab.icon}</div>
          <Link href={tab.link} className="w-full text-sm">
            {tab.text}
          </Link>
        </div>
      ))}
      </div>
      
    </div>
  );
};

export default DesktopDrawer