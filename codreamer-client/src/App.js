import { useState, useEffect } from "react";
import EntryScene from "./component/EntryScene";
import HallScene from "./component/HallScene";
import LoginView from "./component/deprecated/LoginView";
import LobbyView from "./component/deprecated/LobbyView";
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

  const handleScene = (scene_name) => {
    if (scene_name === "hall") {
      app.fire("nakama_init", nakama);
    }
    setScene(scene_name);
  };

  useEffect(() => {
    app.on("scene_init", handleScene);
    return () => {
      app.off("scene_init", handleScene);
    };
  });
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
      {scene === "hall" && <HallScene app={app} nakama={nakama} />}
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
