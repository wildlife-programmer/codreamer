import { useEffect, useState } from "react";
const LoadingScene = ({ app }) => {
  const [isLoading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const handleLoading = (bool, total, current) => {
    setLoading(bool);
    if (total) {
      const temp = Math.floor((current / total) * 100);
      setPercentage(temp);
    } else setPercentage(0);
  };
  useEffect(() => {
    app.on("loading", handleLoading);
  }, []);
  return (
    <div className={isLoading ? "loading_on" : "loading_off"}>
      <div>LoadingView</div>
      {percentage > 0 && (
        <div
          style={{
            width: 200,
            height: 20,
            border: "2px solid red",
          }}
        >
          <div
            className="percentage"
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: "red",
            }}
          ></div>
        </div>
      )}
      {(percentage >= 100 || !percentage) && <>로딩중ㅋ</>}
    </div>
  );
};
export default LoadingScene;
