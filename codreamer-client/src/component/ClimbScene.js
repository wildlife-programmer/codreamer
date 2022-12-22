import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
const ClimbScene = ({ app, nakama }) => {
  const [gameId, setGameId] = useState("");
  const [record, setRecord] = useState(0);
  const [started, setStarted] = useState(false);
  const handleGameId = (game_id) => setGameId(game_id);
  const handleRecord = (data) => {
    const my_record = data.toFixed(3);
    app.fire("climb#validation", nakama, gameId, my_record);
    setRecord(my_record);
    setTimeout(() => {
      setRecord(0);
    }, 3000);
  };
  const handleExit = () => app.fire("scene_change", "hall");
  const handleStart = () => {
    app.fire("climb#start");
    setStarted(true);
  };
  const handleFinish = () => setStarted(false);

  useEffect(() => {
    app.on("climb#game_id", handleGameId);
    app.on("climb#finish", handleFinish);
    return () => {
      app.off("climb#game_id", handleGameId);
      app.off("climb#finish", handleFinish);
    };
  }, []);
  useEffect(() => {
    if (gameId !== "") app.on("climb#record", handleRecord);
    else app.off("climb#record", handleRecord);
  }, [gameId]);
  return (
    <div className="climb_container">
      {record !== 0 && (
        <div className="climb_record">
          <div className="climb_record_title">MY RECORD</div>
          <div>[ {record} ]s</div>
        </div>
      )}
      <div className="climb_exit" onClick={handleExit}>
        <LogoutIcon />
      </div>
      <div>Climb Scene</div>
      {!started && (
        <div className="climb_button_start" onClick={handleStart}>
          START
        </div>
      )}
    </div>
  );
};

export default ClimbScene;
