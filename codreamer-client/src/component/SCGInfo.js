import { useState, useEffect } from "react";
import SpeedClickRankboard from "./SpeedClickRankboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const SCGInfo = ({ app, nakama, open }) => {
  const [developers, setDevelopers] = useState([]);
  const [playcount, setPlaycount] = useState(0);
  const [rankboardOpen, setRankboardOpen] = useState(false);

  const getPlaycount = async () => {
    const data = await nakama.socket.rpc(
      "get_playcount",
      JSON.stringify({ game: "speed_click" })
    );
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    if (payload.play_count) setPlaycount(payload.play_count);
  };

  const getDeveloper = async () => {
    const data = await nakama.socket.rpc("get_developer", "speed_click");
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    if (payload.developer) setDevelopers(payload.developer);
  };

  useEffect(() => {
    getPlaycount();
    getDeveloper();
  }, []);
  return rankboardOpen ? (
    <SpeedClickRankboard
      app={app}
      nakama={nakama}
      exit={() => {
        setRankboardOpen(false);
      }}
    />
  ) : (
    <div>
      <div className="gamezone_title">Speed Click</div>
      <img
        className="gameinfo_image"
        alt="speed_click_game"
        width="100%"
        src="/image/speed_click_game.png"
      />
      <div>
        <div className="table_container">
          <span className="table_title">Visits</span>
          <div className="table_body">{playcount}</div>
        </div>
        {developers.length > 0 && (
          <div className="table_container">
            <span className="table_title">By</span>
            <div className="table_body">
              {developers.map((developer, index) => (
                <div key={`developer_${index}`}>{developer.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      <hr className="horizon" />
      <div className="button_container">
        <button
          className="button_rankboard"
          onClick={() => {
            setRankboardOpen(true);
          }}
        >
          <MilitaryTechIcon />
        </button>
        <button className="button_play" onClick={open}>
          <PlayArrowIcon />
        </button>
      </div>
    </div>
  );
};

export default SCGInfo;
