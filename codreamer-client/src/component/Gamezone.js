import { useState, useEffect } from "react";
import ClimbInfo from "./ClimbInfo";
import SCGInfo from "./SCGInfo";
import CancelIcon from "@mui/icons-material/Cancel";
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

  useEffect(() => {}, [currentGamezone]);

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
            <SCGInfo
              app={app}
              nakama={nakama}
              open={() => {
                setCurrentGamezone(0);
                setSCGopen(true);
              }}
            />
          )}
        </div>
      )}
      {SCGopen && (
        <SpeedClickGame
          nakama={nakama}
          goMain={() => {
            setCurrentGamezone(2);
            setSCGopen(false);
          }}
        />
      )}
    </>
  );
};

export default Gamezone;
