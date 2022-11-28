import { useState, useEffect } from "react";
import "../App.css";
const GuestBook = ({ app, nakama }) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [guestBook, setGuestBook] = useState([]);
  const [cursor, setCursor] = useState(0);
  const handleGuestBook = (bool) => {
    setOpen(bool);
  };
  const handleClose = () => {
    app.fire("move#able", true);
    setOpen(false);
  };
  const handleName = (e) => {
    if (!open) return;
    if (e.target.value.length > 10)
      e.target.value = e.target.value.slice(0, 10);
    setName(e.target.value);
  };
  const handleMessage = (e) => {
    if (!open) return;
    if (e.target.value.length > 20)
      e.target.value = e.target.value.slice(0, 20);
    setMessage(e.target.value);
  };
  const getGuestBook = async () => {
    const result = await nakama.socket.rpc("get_guestbook");
    const payload = JSON.parse(result.payload);
    console.log(payload);
    const temp = [];
    if (payload.length > 0) {
      payload.forEach((storage) => {
        const value = JSON.parse(storage.value);
        const messages = value.messages;
        console.log("value", value);
        messages.forEach((message) => temp.push(message));
      });
    }
    app.fire("guestbook#get", temp);
    setGuestBook(temp);
  };

  const handleAdd = async () => {
    if (name === "" || message === "") return;
    const result = await nakama.socket.rpc(
      "add_guest_message",
      JSON.stringify({ name: name, message: message })
    );
    const payload = JSON.parse(result.payload);
    if (payload.success) {
      getGuestBook();
    }
    console.log("result", result);
  };
  useEffect(() => {
    app.on("guestbook", handleGuestBook);
    return () => {
      const name = document.querySelector(".guestbook_name");
      const message = document.querySelector(".guestbook_message");
      name.blur();
      message.blur();
      app.on("guestbook", handleGuestBook);
    };
  }, []);
  return (
    <div className={open ? "guestbook_on" : "guestbook_off"}>
      <div className="guestbook_container">
        <div>
          <span>이름</span>
          <input
            disabled={!open}
            className="guestbook_name"
            value={name}
            onChange={handleName}
            placeholder="이름"
          ></input>
        </div>
        <div>
          <span>메세지</span>
          <textarea
            disabled={!open}
            className="guestbook_message"
            value={message}
            onChange={handleMessage}
            placeholder="메세지"
          ></textarea>
        </div>
        <div className="guestbook_button">
          <button onClick={handleAdd} className="guestbook_send">
            남기기
          </button>
          <button onClick={handleClose} className="guestbook_close">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestBook;
