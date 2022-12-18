import { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const SpeedClickGame = ({ setSCGopen }) => {
  const [scgClick, setScgClick] = useState(false);
  const [step, setStep] = useState(0);
  const [num, setNum] = useState(0);
  // const num1 = [1,2,3,4,5,6,7,8,9];
  // const numList = num1.map((num1, inx) => <div key={inx}>{num1}</div>)
  // const numbers = [...Array(9).keys()];
  // const [state, setState] = useState[(0, 0, 0, 0, 0, 0, 0, 0, 0)];
  
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
        <div onClick={() => { step_(1); }}>1 단계</div>
        <div onClick={() => { step_(2); }}>2 단계</div>
        <div onClick={() => { step_(3); }}>3 단계</div>
        <div onClick={() => { step_(4); }}>4 단계</div>
        <div onClick={() => { step_(5); }}>5 단계</div>
      </div>
      <CancelIcon onClick={() => setSCGopen(false)} className="close_button" />
      <div className="slectStep">
        {step === 1 && (
          <>
            <button className="scg_start" onClick={handleClick}>
              start
            </button>
            <div className="step_1">
              <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div>
              {/* <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div>
              <div className="sgcCell">{randomNumber()}</div> */}
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
