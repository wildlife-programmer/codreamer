import { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";

const ClimbRankboard = ({ app, nakama, exit }) => {
  const [myRank, setMyRank] = useState();
  const [rankData, setRankData] = useState([]);
  const [playcount, setPlaycount] = useState(0);

  const getClimbRankboard = async () => {
    const data = await nakama.socket.rpc("climb_get_record");
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    const my_rank = payload.ownerRecords;
    const rank_data = payload.records;
    if (Array.isArray(my_rank)) setMyRank(my_rank[0]);
    if (Array.isArray(rank_data)) setRankData(rank_data);
  };

  const getClimbPlaycount = async () => {
    const data = await nakama.socket.rpc("climb_get_playcount");
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    if (payload.playcount) setPlaycount(payload.playcount);
  };
  useEffect(() => {
    if (!nakama) return;
    setTimeout(() => {
      getClimbPlaycount();
      getClimbRankboard();
    }, 1000);
  }, []);
  return (
    <div className="gamezone_container">
      <CancelIcon onClick={exit} className="close_button" />
      <div className="gamezone_title">rankboard</div>
      <div className="climb_rankboard_body">
        {rankData.length > 0 ? (
          rankData.map((record) => (
            <div key={`rank_${record.rank}`} className="climb_record_container">
              <div className="climb_record_rank">{record.rank}</div>
              <div className="climb_record_username">{record.username}</div>
              <div className="climb_record_score">{record.score / 1000}s</div>
            </div>
          ))
        ) : (
          <div className="climb_progress">
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimbRankboard;
