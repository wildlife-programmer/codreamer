import { useState, useEffect } from "react";
import ClimbRankboard from "./ClimbRankboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const ClimbInfo = ({ app, nakama }) => {
  const [climbRankboardOpen, setClimbRankboardOpen] = useState(false);
  const [playcount, setPlaycount] = useState(0);
  const [developers, setDevelopers] = useState([]);

  const tryJoin = (scene_name) => {
    app.fire("scene_change", scene_name);
  };

  const getClimbPlaycount = async () => {
    const data = await nakama.socket.rpc("climb_get_playcount");
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    if (payload.play_count) setPlaycount(payload.play_count);
  };

  const getClimbDeveloper = async () => {
    const data = await nakama.socket.rpc("get_developer", "climb");
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    if (payload.developer) setDevelopers(payload.developer);
  };

  useEffect(() => {
    if (!nakama) return;
    getClimbPlaycount();
    getClimbDeveloper();
  }, []);

  return climbRankboardOpen ? (
    <ClimbRankboard
      app={app}
      nakama={nakama}
      exit={() => {
        setClimbRankboardOpen(false);
      }}
    />
  ) : (
    <>
      <div className="gamezone_title">Climb!</div>
      <div>
        <div className="table_container">
          <img
            className="gameinfo_image"
            alt="climb_game"
            src="/image/climb_game_preview.png"
            width="100%"
          />
        </div>

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
            setClimbRankboardOpen(true);
          }}
        >
          <MilitaryTechIcon />
        </button>
        <button
          className="button_play"
          onClick={() => {
            tryJoin("game_climb");
          }}
        >
          <PlayArrowIcon />
        </button>
      </div>
    </>
  );
};
export default ClimbInfo;
