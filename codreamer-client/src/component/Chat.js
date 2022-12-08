import { useRef, useEffect, useState } from "react";
import "../App.css";
import SendIcon from "@mui/icons-material/Send";
const Chat = ({ app }) => {
  const [chats, setChats] = useState([]);
  const [chatValue, setChatValue] = useState("");
  const [username, setUserName] = useState("");
  const [click, setClick] = useState(false);
  const inputRef = useRef();

  const openChat = () => {
    setClick(!click);
    console.log(click);
  };
  const onKeypress = (e) => {
    if (e.key == "Enter") {
      handleSendMessage();
    }
  };
  const handleChatValue = (e) => {
    setChatValue(e.target.value);
  };
  const handleSendMessage = () => {
    if (!app) return;
    app.fire("chat#send", chatValue);
    setChatValue("");
    inputRef.current.focus();
  };
  const onGetName = (data) => {
    const username = data.username;
    console.log(username);
    setUserName(username);
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
    app.on("chat#get", onGetName);
    app.on("chat#get", onGetChat);
  }, []);

  return (
    <div className="chatWrap">
      <div className={click ? "chat_view" : "chat_view_close"} style={{ overflowY: "auto", width: 300, height: 500, color: "#000" }}>
        <span className="chat_title">Chat</span>
        {chats.length > 0 &&
          chats.map((chat, idx) => (
            <div className="chats" key={idx}>
              <span className="chats_name">{username}</span>
              <span className="chats_message">{chat}</span>
            </div>
          ))}
      </div>
      <div className="chat_container">
        <button className="chat_open_button" onClick={openChat}>
          {click ? "채팅창닫기" : "채팅창열기"}
        </button>
        <input
          className="chat_input"
          ref={inputRef}
          onKeyPress={onKeypress}
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
    </div>
  );
};

export default Chat;
