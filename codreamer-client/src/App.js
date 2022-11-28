import { useState, useEffect } from "react";
import LoginView from "./component/LoginView";
import LobbyView from "./component/LobbyView";
import MainView from "./component/MainView";
import "./App.css";
function App() {
  const [app, setApp] = useState();
  const [nakama, setNakama] = useState();
  const [loaded, setLoaded] = useState(false);
  const [UIState, setUIState] = useState(0);
  const [match, setMatch] = useState();

  const handleLoaded = () => setLoaded(true);

  const onJoinSuccess = () => {
    setUIState(2);
  };

  useEffect(() => {
    const application = window.pc.app;
    setApp(application);
    application.on("loaded", handleLoaded);
    application.on("match#join_success", onJoinSuccess);
    return () => {
      application.off("loaded", handleLoaded);
      application.off("match#join_success", onJoinSuccess);
    };
  }, []);
  return (
    loaded && (
      <div className="App">
        {UIState === 0 && (
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
        {UIState === 2 && <MainView nakama={nakama} app={app} />}
      </div>
    )
  );
}

export default App;
