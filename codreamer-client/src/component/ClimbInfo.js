import { useState, useEffect } from "react";
import ClimbRankboard from "./ClimbRankboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const ClimbInfo = ({ app, nakama, setCurrentGamezone }) => {
  const [climbRankboardOpen, setClimbRankboardOpen] = useState(false);
  const tryJoin = (scene_name) => {
    app.fire("scene_change", scene_name);
  };
  return (
    <>
      <div>
        <div className="gamezone_title">Gamezone 1</div>
        <div className="gamezone_info">
          <div>게임 소개 이미지 혹은 인게임 스크린샷</div>
          <div>현재 플레이중인 사람 수</div>

          <div>방문횟수</div>
          <div>개발자</div>
        </div>
        <div className="button_container">
          <button
            className="button_rankboard"
            onClick={() => {
              setClimbRankboardOpen(true);
              setCurrentGamezone(0);
            }}
          >
            <MilitaryTechIcon />
          </button>
          <button
            className="button_play"
            onClick={() => {
              tryJoin("chapter_1");
              setCurrentGamezone(0);
            }}
          >
            <PlayArrowIcon />
          </button>
        </div>
      </div>

      {climbRankboardOpen && (
        <ClimbRankboard
          app={app}
          nakama={nakama}
          exit={() => {
            setClimbRankboardOpen(false);
            setCurrentGamezone(1);
          }}
        />
      )}
    </>
  );
};
export default ClimbInfo;
