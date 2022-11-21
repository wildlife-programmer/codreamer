import { useState, useEffect } from "react";
const LobbyView = ({ app, setState }) => {
  const [rooms, setRooms] = useState([]);
  const tryCreateMatch = async () => app.fire("match#join");

  return (
    <div className="lobbyview">
      <div>LobbyView</div>
      <div>
        <button onClick={tryCreateMatch}>방 만들기</button>
      </div>
      <div>방 목록</div>
      <div>
        {rooms.length > 0 ? <div></div> : <div>현재 개설된 방이 없습니다.</div>}
      </div>
    </div>
  );
};

export default LobbyView;
