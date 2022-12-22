import { useState, useEffect } from "react";
import "../App.css";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";
import MessageIcon from "@mui/icons-material/Message";
import FileUploadIcon from "@mui/icons-material/FileUpload";
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
    if (!result.payload) return;
    const payload = JSON.parse(result.payload);
    const temp = [];
    if (payload.length > 0) {
      payload.forEach((storage) => {
        const value = JSON.parse(storage.value);
        const messages = value.messages;
        messages.forEach((message) => temp.push(message));
      });
    }
    app.fire("guestbook#get", temp);
    setGuestBook(temp);
  };
  const handleRequestGuestbook = () => {
    getGuestBook();
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
      setName("");
      setMessage("");
    }
  };
  useEffect(() => {
    getGuestBook();
    app.on("guestbook", handleGuestBook);
    app.on("guestbook#request", handleRequestGuestbook);
    return () => {
      const name = document.querySelector(".guestbook_name");
      const message = document.querySelector(".guestbook_message");
      name && name.blur();
      message && message.blur();
      app.off("guestbook", handleGuestBook);
      app.off("guestbook#request", handleRequestGuestbook);
    };
  }, []);
  return (
    <div className={open ? "guestbook_on" : "guestbook_off"}>
      <div className="guestbook_container">
        <div>
          <PersonIcon className="guestbook_icon" />
          <input
            disabled={!open}
            className="guestbook_name"
            value={name}
            onChange={handleName}
            placeholder="이름"
          ></input>
        </div>
        <div>
          <MessageIcon className="guestbook_icon" />
          <textarea
            disabled={!open}
            className="guestbook_message"
            value={message}
            onChange={handleMessage}
            placeholder="메세지"
          ></textarea>
        </div>
        <FileUploadIcon onClick={handleAdd} className="guestbook_send" />
        {open && (
          <CancelIcon onClick={handleClose} className="guestbook_close" />
        )}
      </div>
    </div>
  );
};

export default GuestBook;
