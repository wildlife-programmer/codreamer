import Chat from "./Chat";
import GithubInfo from "./GithubInfo";
import GuestBook from "./GuestBook";

const MainView = ({ app, setState }) => {
  return (
    <div>
      <GithubInfo />
      <Chat app={app} setState={setState} />
      <GuestBook app={app} />
    </div>
  );
};

export default MainView;
