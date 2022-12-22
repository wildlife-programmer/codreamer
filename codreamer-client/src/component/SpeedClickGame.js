import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const SpeedClickGame = ({ setSCGopen }) => {
  const mode_list = [3, 4, 5, 6];
  const [page, setPage] = useState(0);
  const [stage, setStage] = useState(0);
  const [board, setBoard] = useState([]);
  const [cursor, setCursor] = useState(1);
  const [isFinished, setFinished] = useState(false);

  const play = (mode) => {
    setPage(1);
    setStage(mode);
  };

  const timer = () => {
    console.log(timer);
  };

  const check = (number) => {
    if (number !== cursor) return;
    if (cursor === stage * stage) {
      setFinished(true);
      console.log("finished");
      return;
    }
    setCursor(cursor + 1);
  };

  const start = () => {
    timer();
    console.log(start);
  };

  const showBoard = (board) => {
    const temp = Array(stage).fill(0);
    return temp.map((_, idx) => {
      return (
        <div className="board_column" key={idx}>
          {board.map((number, index) => {
            const share = Math.floor(index / stage);
            if (share === idx) {
              return (
                <div className="board_row" key={index} onClick={() => check(number)}>
                  {number}
                </div>
              );
            }
          })}
        </div>
      );
    });
  };

  useEffect(() => {
    if (stage === 0) return;
    const boardData = Array(stage * stage).fill(0);
    boardData.forEach((data, index) => (boardData[index] = index + 1));
    boardData.sort(() => Math.random() - 0.5);
    setBoard(boardData);
  }, [stage]);

  return (
    <div
      className="speedClickGame_container"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      {page === 0 && (
        <>
          <div>Speed Click Game</div>
          <div>메뉴판</div>
          {mode_list.map((mode, index) => {
            return (
              <div key={`mode_${index}`} onClick={() => play(mode)}>
                {mode}
              </div>
            );
          })}
          <CancelIcon onClick={() => setSCGopen(false)} className="close_button" />
        </>
      )}
      {page === 1 && (
        <>
          <div>STAGE {stage}</div>
          <div
            onClick={() => {
              start();
            }}
          >
            START
          </div>
          {isFinished && <div>FINISHED!</div>}
          <div>{board.length > 0 && showBoard(board)}</div>
          <CancelIcon onClick={() => setPage(0)} className="close_button" />
        </>
      )}
    </div>
  );
};

export default SpeedClickGame;
