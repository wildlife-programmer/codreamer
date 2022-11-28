import Chat from "./Chat";
import GithubInfo from "./GithubInfo";
import GuestBook from "./GuestBook";

const MainView = ({ nakama, app, setState }) => {
  return (
    <div>
      <GithubInfo />
      <Chat app={app} setState={setState} />
      <GuestBook nakama={nakama} app={app} />
    </div>
  );
};

export default MainView;
