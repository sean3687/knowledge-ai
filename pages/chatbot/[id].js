import Controller from "../../components/chatbot/controller";
import { } from "react-icons/ai"
import withLayout from "../../components/layouts/withLayout";

function Chat() {
  return (
    <div className="w-full bg-white flex items-center justify-center">

      <Controller />
      
    </div>
  );
}

export default withLayout(Chat, 'dashboard');
