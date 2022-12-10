import { useState, useEffect } from "react";
import EntryScene from "./component/EntryScene";
import LoginView from "./component/LoginView";
import LobbyView from "./component/LobbyView";
import MainView from "./component/MainView";
import LoadingScene from "./component/LoadingScene";
import "./App.css";

const app = window.pc.app;
function App() {
  const [scene, setScene] = useState();
  const [account, setAccount] = useState();
  const [nakama, setNakama] = useState();

  const [UIState, setUIState] = useState(0);
  const [match, setMatch] = useState();

  const handleScene = (scene_name) => setScene(scene_name);

  const onJoinSuccess = () => {
    setUIState(2);
  };

  useEffect(() => {
    app.on("scene_init", handleScene);
    app.on("match#join_success", onJoinSuccess);
    return () => {
      app.off("scene_init", handleScene);
      app.off("match#join_success", onJoinSuccess);
    };
  }, []);
  return (
    <div className="App">
      <LoadingScene app={app} />
      {scene === "entry" && (
        <EntryScene
          nakama={nakama}
          setNakama={setNakama}
          app={app}
          account={account}
          setAccount={setAccount}
        />
      )}
      {/* {UIState === 0 && (
          <div className="container">
            <LoginView setNakama={setNakama} app={app} setState={setUIState} />
          </div>
        )}
        {UIState === 1 && (
          <div className="container">
            <LobbyView
              nakama={nakama}
              app={app}
              setState={setUIState}
              setMatch={setMatch}
            />
          </div>
        )}
        {UIState === 2 && <MainView nakama={nakama} app={app} />} */}
    </div>
  );
}

export default App;
