import { useState, useEffect } from "react";
const Chapter1Scene = ({ app }) => {
  const [record, setRecord] = useState(0);
  const handleRecord = (data) => {
    setRecord(data);
    setTimeout(() => {
      setRecord(0);
    }, 3000);
  };
  useEffect(() => {
    app.on("ch1#record", handleRecord);
    return () => {
      app.off("ch1#record", handleRecord);
    };
  }, []);
  return (
    <div>
      {record !== 0 && (
        <div className="ch1_record">
          <div>내 기록</div>
          <div>{record}초</div>
        </div>
      )}
      <div>Chapter1Scene</div>
    </div>
  );
};

export default Chapter1Scene;
