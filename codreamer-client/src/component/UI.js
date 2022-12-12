import GithubInfo from "./GithubInfo";
import Perspective from "./Perspective";
import VideoConference from "./deprecated/VideoConference";
const UI = ({ app }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* <GithubInfo app={app} /> */}
      <div className="right_top">
        {/* <VideoConference app={app} /> */}
        <Perspective app={app} />
      </div>
    </div>
  );
};

export default UI;
