import moment from 'moment'; // Import moment.js for date manipulation

export default function ChatComponent({ chatList, selectedChatId, handleChatClick, postDeleteChat }) {
    console.log(chatList, selectedChatId, handleChatClick, postDeleteChat);
  // Function to group chats by sections
  const groupChatsBySection = () => {
    const today = [];
    const yesterday = [];
    const last7Days = [];
    const last30Days = [];

    const now = moment();
    chatList.forEach(chat => {
      const chatTime = moment(chat.last_chat_time);
      const diffDays = now.diff(chatTime, 'days');

      if (diffDays === 0) today.push(chat);
      else if (diffDays === 1) yesterday.push(chat);
      else if (diffDays < 7) last7Days.push(chat);
      else if (diffDays < 30) last30Days.push(chat);
    });

    return { today, yesterday, last7Days, last30Days };
  };

  // Grouped chat sections
  const { today, yesterday, last7Days, last30Days } = groupChatsBySection();

  return (
    <div>
      {[{ label: 'Today', chats: today },
        { label: 'Yesterday', chats: yesterday },
        { label: 'Previous 7 Days', chats: last7Days },
        { label: 'Previous 30 Days', chats: last30Days }]
        .map(section => (
          section.chats.length > 0 && (
            <div key={section.label}>
              <h2>{section.label}</h2>
              <ul>
                {section.chats.map(chat => (
                  <li key={chat.chat_id} onClick={() => handleChatClick(chat.chat_id)} className={selectedChatId === chat.chat_id ? "text-blue-800" : ""}>
                    {/* The rest of your chat rendering logic */}
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}
    </div>
  );
}