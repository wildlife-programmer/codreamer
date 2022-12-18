import CancelIcon from "@mui/icons-material/Cancel";
const SpeedClickGame = ({ setSCGopen }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <div>Speed Click Game</div>
      <CancelIcon onClick={() => setSCGopen(false)} className="close_button" />
    </div>
  );
};

export default SpeedClickGame;
