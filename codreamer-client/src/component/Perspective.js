import { useEffect, useState } from "react";
import SwitchVideoIcon from "@mui/icons-material/SwitchVideo";
const Perspective = ({ app }) => {
  const [fpv, setfpv] = useState(false);
  useEffect(() => {
    if (fpv) app.fire("fpv", true);
    else app.fire("fpv", false);
  }, [fpv]);
  return (
    <SwitchVideoIcon
      className="perspective_icon"
      onClick={() => setfpv(!fpv)}
    />
  );
};

export default Perspective;
