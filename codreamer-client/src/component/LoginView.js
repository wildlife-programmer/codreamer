import { useState } from "react";
import Nakama from "../nakama/nakama";

const LoginView = ({ setState, app }) => {
  const [inputValue, setInputValue] = useState("12345678");
  const handleInput = (ev) => {
    setInputValue(ev.target.value);
  };

  const tryAuth = async () => {
    if (inputValue.length <= 0) return;
    try {
      const nakama = (window.nakama = new Nakama());
      let useSSL = false;
      let verbose = false;
      let protobuf = true;
      nakama.initialize({
        host: process.env.REACT_APP_HOST,
        port: process.env.REACT_APP_PORT,
        serverkey: process.env.REACT_APP_KEY,
        useSSL: useSSL,
      });
      const response = await nakama.authenticateCustom(inputValue);
      if (response) {
        await nakama.connect(useSSL, verbose, protobuf);
        app.fire("nakama#init", nakama);
        setState(1);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="loginview">
      <div>
        <input value={inputValue} onChange={handleInput}></input>
        <button onClick={tryAuth}>로그인</button>
      </div>
    </div>
  );
};

export default LoginView;
