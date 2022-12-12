import { useState, useEffect } from "react";
import Chat from "./Chat";
import UI from "./UI";
import GuestBook from "./GuestBook";
const HallScene = ({ app, nakama }) => {
  const [matchId, setMatchId] = useState();
  const [hallJoined, setHallJoined] = useState(false);
  const [chatJoined, setChatJoined] = useState(false);
  const onChannelMessage = (message) => {
    app.fire("chat#speak", message);
  };
  const onChannelPresence = (message) => {};
  useEffect(() => {
    (async () => {
      const result = await nakama.socket.rpc("match_create");
      const match_id = result.payload;
      const match = await nakama.socket.joinMatch(match_id);
      if (match) {
        setMatchId(match_id);
        setHallJoined(true);
        app.fire("match#join_success", match_id);
        const chat = await nakama.socket.joinChat(match_id, 1, true, false);
        if (chat) setChatJoined(true);
      }
    })();
  }, []);
  useEffect(() => {
    if (chatJoined) {
      nakama.socket.onchannelmessage = onChannelMessage;
      nakama.socket.onchannelpresence = onChannelPresence;
    }
  }, [chatJoined]);
  return (
    hallJoined && (
      <div className="scene_hall">
        <div>Hall Scene</div>
        {chatJoined && <Chat app={app} nakama={nakama} matchId={matchId} />}
        <UI app={app} />
        <GuestBook app={app} nakama={nakama} />
      </div>
    )
  );
};
export default HallScene;
