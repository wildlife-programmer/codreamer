import Chat from "./Chat";
import GuestBook from "./GuestBook";
import UI from "./UI";

const MainView = ({ nakama, app, setState }) => {
  return (
    <div style={{ pointerEvents: "auto" }}>
      <UI app={app} />
      <Chat app={app} setState={setState} />
      <GuestBook nakama={nakama} app={app} />
    </div>
  );
};

export default MainView;
