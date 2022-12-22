import { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const SpeedClickGame = ({ goMain }) => {
  const mode_list = [3, 4, 5, 6];
  const [page, setPage] = useState(0);
  const [stage, setStage] = useState(0);
  const [board, setBoard] = useState([]);
  const [cursor, setCursor] = useState(1);

  const [timer, setTimer] = useState();
  const [time, setTime] = useState(0);
  const [currentTick, setCurrentTick] = useState(0);

  const [isStarted, setStarted] = useState(false);
  const [fault, setFault] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const tick = () => {
    setCurrentTick(window.performance.now());
    const req = requestAnimationFrame(tick);
    setTimer(req);
  };

  const start = () => {
    board.forEach((data, index) => (board[index] = index + 1));
    board.sort(() => Math.random() - 0.5);
    setBoard(board);
  };
  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        const next = countdown - 1;
        if (next > 0) {
          setCountdown(countdown - 1);
        } else {
          setStarted(true);
          start();
          setCountdown(0);
          setTime(0);
          tick();
        }
      }, 1000);
    }
  }, [countdown]);

  const play = (mode) => {
    setPage(1);
    setStage(mode);
    setCursor(1);
  };

  const finish = () => {
    cancelAnimationFrame(timer);
    setTimer();
    setCursor(1);
    setStarted(false);
    resetBoard();
  };

  const check = (number) => {
    if (number !== cursor) {
      setFault(true);
      return;
    }
    if (number === stage * stage) {
      finish();
      return;
    }
    setCursor(cursor + 1);
  };
  const resetBoard = () => {
    board.fill(0);
    setBoard(board);
  };
  const resetGame = () => {
    setPage(0);
    setTime(0);
    resetBoard();
    setStarted(false);
    setFault(false);
    setCurrentTick(0);
    cancelAnimationFrame(timer);
    setTimer();
  };
  const showBoard = (board) => {
    const temp = Array(stage).fill(0);
    return temp.map((_, idx) => {
      return (
        <div key={`column_${idx}`} className="board_column">
          {board.map((number, index) => {
            const share = Math.floor(index / stage);
            if (share === idx) {
              return (
                <div
                  key={`row_${index}`}
                  onClick={() => isStarted && !fault && check(number)}
                  className={`board_row ${number < cursor && "checked"}`}
                >
                  {number > 0 ? number : ""}
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

    setBoard(boardData);
  }, [stage]);

  useEffect(() => {
    if (currentTick !== 0) {
      let diff;
      diff = window.performance.now() - currentTick;
      setTime((Number(time) + diff / 100).toFixed(3));
    }
  }, [currentTick]);

  useEffect(() => {
    if (fault) {
      setTimeout(() => {
        setFault(false);
      }, 1000);
    }
  }, [fault]);
  return (
    <div className="gamezone_container">
      {page === 0 && (
        <>
          <div className="gamezone_title">Speed Click Game</div>
          {mode_list.map((mode, index) => {
            return (
              <div
                className="scg_stage"
                key={`mode_${index}`}
                onClick={() => play(mode)}
              >
                {mode} x {mode}
              </div>
            );
          })}
          <CancelIcon onClick={goMain} className="close_button" />
        </>
      )}
      {page === 1 && (
        <div className="scg_container">
          {countdown > 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 100,
                fontWeight: "bold",
              }}
            >
              {countdown}
            </div>
          )}
          <div>{time}</div>
          <div>STAGE {stage}</div>
          <div>{board.length > 0 && showBoard(board)}</div>
          {!isStarted && (
            <div
              onClick={() => {
                if (isStarted) return;
                setCountdown(3);
              }}
            >
              START
            </div>
          )}

          <CancelIcon onClick={resetGame} className="close_button" />
        </div>
      )}
    </div>
  );
};

export default SpeedClickGame;
