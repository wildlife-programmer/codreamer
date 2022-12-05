import { useEffect, useState } from "react";
import "../App.css";
import SendIcon from "@mui/icons-material/Send";
const Chat = ({ app }) => {
  const [chats, setChats] = useState([]);
  const [chatValue, setChatValue] = useState("");
  const [click, setClick] = useState(false);
  const openChat = () => {
    setClick(!click);
    console.log(click);
  };
  const handleChatValue = (e) => {
    setChatValue(e.target.value);
  };
  const handleSendMessage = () => {
    if (!app) return;
    app.fire("chat#send", chatValue);
    setChatValue("");
  };
  const onGetChat = (data) => {
    console.log("data", data);
    const message = data.content.message;
    setChats((prev) => {
      let temp = [...prev, message];
      if (temp.length > 5) temp = temp.slice(1, temp.length);
      return temp;
    });
  };
  useEffect(() => {
    app.on("chat#get", onGetChat);
  }, []);

  return (
    <>
      <div className={click ? "chat_view" : ''} style={{ overflowY: "auto", width: 300, height: 500, color: "#000" }}>
        {chats.length > 0 && chats.map((chat, idx) => <div key={idx}>{chat}</div>)}
      </div>
      <div className="chat_container">
        <button className="chat_open_button" onClick={openChat}>
          {click ? "채팅창닫기" : "채팅창열기"}
        </button>
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
    </>
  );
};

export default Chat;
