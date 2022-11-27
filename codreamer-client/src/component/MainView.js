import Chat from "./Chat";
import GithubInfo from "./GithubInfo";

const MainView = ({ app, setState }) => {
  return (
    <div>
      <GithubInfo />
      <Chat app={app} setState={setState} />
    </div>
  );
};

export default MainView;
