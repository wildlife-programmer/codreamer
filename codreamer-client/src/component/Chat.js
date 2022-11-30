import { useState } from "react";
import "../App.css";
import SendIcon from "@mui/icons-material/Send";
const Chat = ({ app }) => {
  const [chatValue, setChatValue] = useState("");
  const handleChatValue = (e) => {
    setChatValue(e.target.value);
  };
  const handleSendMessage = () => {
    if (!app) return;
    app.fire("chat#send", chatValue);
    setChatValue("");
  };

  return (
    <div className="chat_container">
      <input
        className="chat_input"
        onFocus={() => app.fire("move#disable", false)}
        onBlur={() => app.fire("move#able", true)}
        value={chatValue}
        onChange={handleChatValue}
        placeholder="메세지를 전달해보세요"
      ></input>
      <button className="chat_button" onClick={handleSendMessage}>
        <SendIcon />
      </button>
    </div>
  );
};

export default Chat;
