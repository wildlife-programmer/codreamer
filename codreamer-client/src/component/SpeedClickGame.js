import { useEffect, useMemo, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

// const getNums = () => {
//   const candidates = Array(9)
//     .fill()
//     .map((v, i) => (v = i + 1));
//   const chosenNum = [];

//   while (candidates.length > 0) {
//     const mixedNum = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
//     chosenNum.push(mixedNum);
//   }
//   console.log(chosenNum, "num");

//   const lottoNum = chosenNum.slice(0, 9).sort((p, c) => p - c);

//   console.log(lottoNum);
// };

const SpeedClickGame = ({ setSCGopen }) => {
  const [scgClick, setScgClick] = useState(false);
  const [step, setStep] = useState(0);

  // const getNumsMemo = useMemo(() => getNums(), []);
  // const [lottoNum, setLottoNum] = useState(getNumsMemo);
  // const [winBalls, setWinBalls] = useState([]);
  // const [redo, setRedo] = useState(false);
  // const timeouts = useRef([]);

  // useEffect(() => {
  //   for (let i = 0; i < lottoNum.length - 1; i++) {
  //     timeouts.current[i] = setTimeout(() => {
  //       setWinBalls((prev) => [...prev, lottoNum[i]]);
  //     }, i * 1000);
  //   }
  //   // timeouts.current[6] = setTimeout(() => {
  //   //   setRedo(true);
  //   // }, 7000);
  //   return () => {
  //     timeouts.current.forEach((v) => clearTimeout(v));
  //   };
  // }, [timeouts.current]);

  // const onClickRedo = () => {
  //   setLottoNum(getNums());
  //   setWinBalls([]);
  //   // setRedo(false);
  //   // timeouts.current = [];
  // };

  const [num, setNum] = useState([0]);
  // let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // let num_ary = [];
  // const numList = nums.map((nums, idx) => <div key={idx}>{nums}</div>);

  // const make_number = () => {
  //   nums.map(function (i) {
  //     for (let i = 0; i < 9; i += 1) {
  //       let outed = nums.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
  //       num_ary.push(outed);
  //     }
  //     console.log(num_ary);
  //   });
  // };
  // console.log(numList[2].key);

  // const num1 = [1,2,3,4,5,6,7,8,9];
  // const numbers = [...Array(9).keys()];

  // const randomize = () => {
  //   if (!state) {
  //     const numberCopy = numbers.map((x) => x);
  //     const arr = [];
  //     for (let i = 0; i <= 7; i++) {
  //       const random = Math.floor(Math.random() * 9 + 1);
  //       arr.push(numberCopy[random] + 1);
  //       numberCopy.splice(random, 1);
  //     }
  //     setState({number: arr});
  //   }
  // };

  const handleStep = () => {
    setScgClick(!scgClick);
  };

  const step_ = (step) => {
    // console.log(step);
    setStep(step);
  };

  const randomNumber = () => {
    let randomIndexArray = [];

    for (let i = 0; i < 9; i++) {
      let randomNum = Math.floor(Math.random() * 9 + 1);
      if (randomIndexArray.indexOf(randomNum) === -1) {
        randomIndexArray.push(randomNum);
      } else {
        i--;
      }
    }
    console.log(randomIndexArray);
    return randomIndexArray;
  };

  const handleClick = () => {
    setNum(randomNumber());
    // setNum(make_number());
    // getNums(setWinBalls);
    // console.log(setWinBalls);
    // console.log(randomNumber());
  };

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
      <button className={step ? "SCG_start_on" : "SCG_start_off"} onClick={handleStep}>
        Speed Click Game
      </button>
      <div className={scgClick ? "SCG_step_off" : "SCG_step_on"}>
        <div
          onClick={() => {
            step_(1);
          }}
        >
          1 단계
        </div>
        <div
          onClick={() => {
            step_(2);
          }}
        >
          2 단계
        </div>
        <div
          onClick={() => {
            step_(3);
          }}
        >
          3 단계
        </div>
        <div
          onClick={() => {
            step_(4);
          }}
        >
          4 단계
        </div>
        <div
          onClick={() => {
            step_(5);
          }}
        >
          5 단계
        </div>
      </div>
      <CancelIcon onClick={() => setSCGopen(false)} className="close_button" />
      <div className="slectStep">
        {step === 1 && (
          <>
            {/* <div>
              {winBalls.map((num) => (
                <>
                  <div>esfd</div>
                </>
              ))}
              {redo && <button onClick={redo ? onClickRedo : () => {}}>한 번 더!</button>}
            </div> */}
            <button className="scg_start" onClick={handleClick}>
              start
            </button>
            <div className="step_1">
              <div className="sgcCell">{randomNumber()}</div>
              {/* <div className="sgcCell">{numList}</div> */}
              {/* <div className="sgcCell">{numList[2]}</div> */}
              {/* <div className="sgcCell">{num_ary[5]}</div> */}
              {/* <div className="sgcCell">{setWinBalls}</div> */}
              {/* <div className="sgcCell">{getNums()}</div> */}
              {/* <div className="sgcCell">{setNum()}</div> */}
            </div>
          </>
        )}
        {step === 2 && (
          <div className="step_2">
            <div className="sgcCell">1</div>
            <div className="sgcCell">2</div>
            <div className="sgcCell">3</div>
            <div className="sgcCell">4</div>
            <div className="sgcCell">5</div>
            <div className="sgcCell">6</div>
            <div className="sgcCell">7</div>
            <div className="sgcCell">8</div>
            <div className="sgcCell">9</div>
            <div className="sgcCell">10</div>
            <div className="sgcCell">11</div>
            <div className="sgcCell">12</div>
            <div className="sgcCell">13</div>
            <div className="sgcCell">14</div>
            <div className="sgcCell">15</div>
            <div className="sgcCell">16</div>
          </div>
        )}
        {step === 3 && <div className="step_3">{step}나와랏</div>}
        {step === 4 && <div className="step_4">{step}나와랏</div>}
        {step === 5 && <div className="step_5">{step}나와랏</div>}
      </div>
    </div>
  );
};

export default SpeedClickGame;
