import GithubInfo from "./GithubInfo";
import Perspective from "./Perspective";
const UI = ({ app }) => {
  return (
    <div className="ui_container">
      <GithubInfo app={app} />
      <Perspective app={app}/>
    </div>
  );
};

export default UI;
