import { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const ClimbRankboard = ({ app, nakama, exit }) => {
  const [myRank, setMyRank] = useState();
  const [rankData, setRankData] = useState([]);

  const getRankboard = async () => {
    const data = await nakama.socket.rpc(
      "get_leaderboard",
      JSON.stringify({ game: "climb" })
    );
    if (!data.payload) return;
    const payload = JSON.parse(data.payload);
    const my_rank = payload.owner_records;
    const rank_data = payload.records;
    if (Array.isArray(my_rank)) setMyRank(my_rank[0]);
    if (Array.isArray(rank_data)) setRankData(rank_data);
  };
  useEffect(() => {
    if (!nakama) return;
    setTimeout(() => {
      getRankboard();
    }, 1000);
  }, []);
  return (
    <div className="gamezone_container">
      <CancelIcon onClick={exit} className="close_button" />
      <div className="gamezone_title">Rank Board</div>
      <div className="climb_rankboard_body">
        {rankData.length > 0 ? (
          rankData.map((record) => (
            <div
              key={`rank_${record.rank}`}
              className={
                myRank && myRank.owner_id === record.owner_id
                  ? "climb_my_record_container"
                  : "climb_record_container"
              }
            >
              <div className="climb_record_left">
                <div className="climb_record_rank">{record.rank}</div>
                <div className="climb_record_username">{record.username}</div>
              </div>
              <div className="climb_record_score">{record.score / 1000}s</div>
            </div>
          ))
        ) : (
          <div>No Record</div>
        )}
      </div>
      <div className="climb_my_record_container">
        <div className="climb_record_left">
          <div className="climb_record_rank">{myRank ? myRank.rank : "-"}</div>
          <div className="climb_record_username">
            {myRank ? myRank.username : "-"}
          </div>
        </div>
        <div className="climb_record_score">
          {myRank ? `${myRank.score / 1000}s` : "-"}
        </div>
      </div>
    </div>
  );
};

export default ClimbRankboard;
