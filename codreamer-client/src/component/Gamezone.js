import { useState, useEffect } from "react";
import ClimbInfo from "./ClimbInfo";
import CancelIcon from "@mui/icons-material/Cancel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SpeedClickGame from "./SpeedClickGame";

const Gamezone = ({ app, nakama }) => {
  const [currentGamezone, setCurrentGamezone] = useState(0);

  const [SCGopen, setSCGopen] = useState(false);

  const handleGamezone = (zone_number) => {
    setCurrentGamezone(zone_number);
  };

  useEffect(() => {
    app.on("gamezone", handleGamezone);
    return () => {
      app.off("gamezone", handleGamezone);
    };
  }, []);

  return (
    <>
      {currentGamezone !== 0 && (
        <div className="gamezone_container">
          <CancelIcon
            onClick={() => setCurrentGamezone(0)}
            className="close_button"
          />
          {currentGamezone === 1 && <ClimbInfo app={app} nakama={nakama} />}
          {currentGamezone === 2 && (
            <div>
              <div className="gamezone_title">Gamezone 2</div>
              <div>
                <div>게임 소개 이미지 혹은 인게임 스크린샷</div>
                <div>방문횟수</div>
                <div>개발자</div>
              </div>
              <button
                className="button_play"
                onClick={() => {
                  setSCGopen(true);
                  setCurrentGamezone(0);
                }}
              >
                <PlayArrowIcon />
              </button>
            </div>
          )}
        </div>
      )}
      {SCGopen && <SpeedClickGame setSCGopen={setSCGopen} />}
    </>
  );
};

export default Gamezone;