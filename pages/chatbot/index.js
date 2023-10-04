import Controller from "../../components/controller";
import { } from "react-icons/ai"
import withLayout from "../../components/layouts/withLayout";

function Chat() {

  async function handlenewConversation() {  
    console.log("handlenewConversation");
    await setNewChatId
    
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
      router.push(`/chatbot/${chatId}`, undefined, { shallow: true });

      return chatId;
    } catch (error) {
      console.error("Error getting new chat ID", error);
      return;
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

    {/* Chatbot Intro Container */}
    <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
      
      {/* Chatbot Icon or Logo */}
      <div className="bg-indigo-600 w-16 h-16 rounded-full mx-auto mb-6"></div> 

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-4 text-center">Welcome to Knowledge AI</h1>

      {/* Instructions */}
      <p className="text-gray-600 mb-4 text-center">Follow these simple steps to get started:</p>
      <ul className="list-disc pl-5">
        <li className="mb-2">Upload Your Documents</li>
        <li>Click on "New Conversation" and start chatting!</li>
      </ul>
      
      {/* Optional: Add a button to start a new conversation */}
      <div className="mt-8 text-center">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full" onClick={handlenewConversation}>
          New Conversation
        </button>
      </div>
    </div>

  </div>
  );
}

export default withLayout(Chat, 'dashboard');