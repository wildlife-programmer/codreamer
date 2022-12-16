import { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import UserInfo from "./UserInfo";

const EntryScene = ({ app, account, setAccount, nakama, setNakama }) => {
  const [needLogin, setNeedLogin] = useState(false);
  const [joinRequest, setJoinRequest] = useState(false);
  const handlePortal = () => {
    if (account) setJoinRequest(true);
    else setNeedLogin(true);
  };
  const tryJoin = (scene_name) => app.fire("scene_change", scene_name);
  useEffect(() => {
    app.on("entry_portal", handlePortal);
    return () => app.off("entry_portal", handlePortal);
  }, [account]);
  return (
    <div className="scene_entry" style={{ color: "#fff" }}>
      <UserInfo
        app={app}
        account={account}
        setAccount={setAccount}
        nakama={nakama}
        setNakama={setNakama}
      />
      {needLogin && (
        <div className="need_login">
          <div>
            광장에 입장하려면
            <br /> 로그인이 필요합니다
          </div>
          <CancelIcon
            onClick={() => setNeedLogin(false)}
            className="close_button"
          />
        </div>
      )}
      {joinRequest && (
        <div className="join_hall_request">
          <div className="request_title">광장에 입장하시겠습니까?</div>
          <div className="request_button" onClick={() => tryJoin("hall")}>
            입장
          </div>
          <CancelIcon
            onClick={() => setJoinRequest(false)}
            className="close_button"
          />
        </div>
      )}
    </div>
  );
};

export default EntryScene;
