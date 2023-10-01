import React from "react";
import { PiChatDuotone, PiTrashDuotone } from "react-icons/pi";
import Link from "next/link";

const ChatComponent = React.memo(function ChatComponent({
  chat,
  selectedChatId,
  handleChatClick,
  postDeleteChat,
}) {
  return (
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
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 pr-2">
            <PiTrashDuotone
              onClick={(e) => {
                postDeleteChat(chat.chat_id);
              }}
            />
          </div>
        )}
      </Link>
    </li>
  );
});

export default ChatComponent;
