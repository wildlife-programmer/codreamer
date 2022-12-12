import { useState, useEffect } from "react";
import Nakama from "../nakama/nakama";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";
const UserInfo = ({ app, account, setAccount, nakama, setNakama }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const checkLogin = () => {
    if (account) setShowInfo(true);
    else setLoginForm(true);
  };
  const generateid = (L) =>
    [...Array(L)]
      .map(() => {
        return Math.random().toString(36)[3];
      })
      .join("");

  const tryLogin = async (code) => {
    try {
      const nakama = new Nakama();
      let useSSL = process.env.NODE_ENV === "production" ? true : false;
      let verbose = false;
      let protobuf = true;
      nakama.initialize({
        host: process.env.REACT_APP_HOST,
        port: process.env.REACT_APP_PORT,
        serverkey: process.env.REACT_APP_KEY,
        useSSL: useSSL,
      });
      const response = await nakama.authenticateCustom(
        code ? code : generateid(12)
      );
      if (response) {
        await nakama.connect(useSSL, verbose, protobuf);
        setNakama(nakama);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (nakama) {
      (async () => {
        const received = await nakama.getAccount();
        console.log(received);
        setAccount(received);
      })();
      setLoginForm(false);
    }
  }, [nakama]);
  return (
    <>
      <div className="user_info_button" onClick={checkLogin}>
        <PersonIcon />
      </div>
      {showInfo && (
        <div className="user_info">
          <div className="username_title">Username</div>
          <div className="my_username">{account.user.username}</div>
          <CancelIcon
            onClick={() => setShowInfo(false)}
            className="close_button"
          />
        </div>
      )}
      {loginForm && (
        <div className="login_form">
          <img alt="codreamer" height="40px" src="/image/codreamer.png" />
          <button onClick={() => tryLogin()} className="login_guest">
            Guest Login
          </button>
          <CancelIcon
            onClick={() => setLoginForm(false)}
            className="close_button"
          />
        </div>
      )}
    </>
  );
};

export default UserInfo;
