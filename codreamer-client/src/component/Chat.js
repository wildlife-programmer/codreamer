import { useState, useEffect, useRef } from "react";
import "../App.css";
const Chat = ({ app, setState }) => {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [chatValue, setChatValue] = useState("");
  const chatObserver = useRef();
  const chatMessageObserver = useRef();
  const handleChatValue = (e) => {
    setChatValue(e.target.value);
  };
  const handleSendMessage = () => {
    if (!app) return;
    app.fire("chat#send", chatValue);
  };

  const onGetChat = (data) => {
    const message = data.content.message;
    setChatLog((prev) => {
      return [...prev, message];
    });
  };
  useEffect(() => {
    return () => {
      if (app) app.off("chat#get", onGetChat);
    };
  }, []);
  useEffect(() => {
    if (app) app.on("chat#get", onGetChat);
  }, [app]);
  useEffect(() => {
    const observer = chatObserver.current;
    const messageObserver = chatMessageObserver.current;
    if (!observer || !messageObserver) return;
    const observerHeight = observer.clientHeight;
    const observerScrollTop = observer.scrollTop;
    const observerScrollHeight = observer.scrollHeight;

    if (
      observerScrollHeight - (observerHeight + observerScrollTop) <
      messageObserver.clientHeight * 2
    )
      observer.scrollTo(0, observerScrollHeight);
  }, [chatLog]);
  return (
    <>
      {!open && (
        <div className="chat_button" onClick={() => setOpen(!open)}>
          chat
        </div>
      )}
      <div className={open ? "chat_on" : "chat_off"}>
        <div className="chat_close" onClick={() => setOpen(false)}>
          x
        </div>
        <div className="chat_log" ref={chatObserver}>
          {chatLog.map((log, index) => (
            <div
              ref={chatMessageObserver}
              className="chat_message"
              key={`chat_${index}`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
      <div className="chat_container">
        <input
          value={chatValue}
          onChange={handleChatValue}
          placeholder="메세지를 전달해보세요"
        ></input>
        <button onClick={handleSendMessage}>보내기</button>
      </div>
    </>
  );
};

export default Chat;
