import { useState, useEffect } from "react";
import LoginView from "./component/LoginView";
import LobbyView from "./component/LobbyView";
import MainView from "./component/MainView";
import "./App.css";
function App() {
  const [app, setApp] = useState();
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
        {UIState === 0 && <LoginView app={app} setState={setUIState} />}
        {UIState === 1 && (
          <LobbyView app={app} setState={setUIState} setMatch={setMatch} />
        )}
        {UIState === 2 && <MainView />}
      </div>
    )
  );
}

export default App;
