
import { usePage } from "@inertiajs/react"; 
const ChatLayout = ({ children})=>{
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    console.log("conversations", conversations);
    console.log("selectedConversation", selectedConversation);

return(
    <div>
        ChatLayout
        <div>{children}</div>
    </div>
);

};

export default ChatLayout;