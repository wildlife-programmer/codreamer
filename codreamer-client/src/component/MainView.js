import Chat from "./Chat";
const MainView = ({ app, setState }) => {
  return (
    <div>
      <Chat app={app} setState={setState} />
    </div>
  );
};

export default MainView;
