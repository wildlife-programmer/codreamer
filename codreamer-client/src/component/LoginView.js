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
      const response = await nakama.authenticateCustom(inputValue);
      console.log("reseponse", response);
      if (response) {
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
