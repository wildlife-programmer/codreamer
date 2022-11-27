import { useEffect, useRef } from "react";
import Nakama from "../nakama/nakama";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Dot } from "./classes";

const LoginView = ({ setState, app, setNakama }) => {
  const loginCanvas = useRef();
  const tryAuth = async (code) => {
    try {
      const nakama = new Nakama();
      let useSSL = process.env.NODE_ENV === "production" ? true : false;
      let verbose = false;
      let protobuf = true;
      nakama.initialize({
        host: process.env.REACT_APP_HOST,
        port: process.env.REACT_APP_PORT,
        serverkey: process.env.REACT_APP_KEY,
        useSSL: useSSL,
      });
      const response = await nakama.authenticateCustom(code ? code : "");
      if (response) {
        await nakama.connect(useSSL, verbose, protobuf);
        app.fire("nakama#init", nakama);
        setState(1);
        setNakama(nakama);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const initCanvas = () => {
    const canvas = loginCanvas.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dots = [];

    for (let i = 0; i < 100; i++) {
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      const dot = new Dot(randomX, randomY);
      dots.push(dot);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let opacity = 1;
      if (dots.length > 0) {
        dots.forEach((dot_1, index_1) => {
          dot_1.update(canvas, ctx);
          dots.forEach((dot_2, index_2) => {
            if (dot_1 === dot_2) return;
            const distance =
              (dot_2.x - dot_1.x) * (dot_2.x - dot_1.x) +
              (dot_2.y - dot_1.y) * (dot_2.y - dot_1.y);
            const rootDistance = Math.sqrt(distance);
            if (rootDistance < 150) {
              opacity = 1 - rootDistance / 150;
              ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(dot_1.x, dot_1.y);
              ctx.lineTo(dot_2.x, dot_2.y);
              ctx.stroke();
            }
          });
        });
      }
      requestAnimationFrame(animate);
    };
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dots.forEach((dot) => {
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height;
        dot.relocate(randomX, randomY);
      });
    });
    animate();
  };
  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    if (authorizationCode) {
      tryAuth(authorizationCode);
    }
    initCanvas();
  }, []);

  return (
    <>
      <div className="loginview">
        <div className="login_form">
          <img alt="codreamer" width="200px" src="/image/codreamer.png" />
          <div
            className="button_github_login"
            onClick={() => {
              const GITHUB_LOGIN_URL =
                "https://github.com/login/oauth/authorize?client_id=be22490f08d955474cb4";
              window.location.assign(GITHUB_LOGIN_URL);
            }}
          >
            <GitHubIcon style={{ marginRight: 8 }} />
            Github Login
          </div>
        </div>
      </div>
      <canvas className="login_canvas" ref={loginCanvas}></canvas>
    </>
  );
};

export default LoginView;
