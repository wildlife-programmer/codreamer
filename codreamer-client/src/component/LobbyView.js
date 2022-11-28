import { useState, useEffect, useRef } from "react";
import { FallingStar } from "./classes";
const LobbyView = ({ app, nakama, setState }) => {
  const lobbyCanvas = useRef();
  const [spaces, setSpaces] = useState([]);
  const tryCreateMatch = async () => app.fire("match#join");
  const joinSpace = (match_id) => {
    app.fire("match#join", match_id);
  };
  const getSpaces = async (nakama) => {
    const socket = nakama.socket;
    const response = await socket.rpc("get_spaces");
    const payload = JSON.parse(response.payload);
    setSpaces(payload);
  };
  const initCanvas = () => {
    const title = document.querySelector(".space_title");
    const content = document.querySelector(".space_body");
    const canvas = lobbyCanvas.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!canvas) return;
    const titleRect = title.getBoundingClientRect();
    // console.log(title, titleRect);
    const t = {
      x: titleRect.left,
      y: titleRect.top,
      width: titleRect.width,
      height: titleRect.height,
    };
    const contentRect = content.getBoundingClientRect();
    const c = {
      x: contentRect.left,
      y: contentRect.top,
      width: contentRect.width,
      height: contentRect.height,
    };
    const ctx = canvas.getContext("2d");
    const stars = [];

    for (let i = 0; i < 100; i++) {
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      const star = new FallingStar(randomX, randomY, t, c);
      stars.push(star);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (stars.length > 0) {
        stars.forEach((star, index) => {
          star.update(canvas, ctx);
        });
      }
      requestAnimationFrame(animate);
    };
    window.addEventListener("resize", () => {
      const title = document.querySelector(".space_title");
      const content = document.querySelector(".space_body");
      const titleRect = title.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const t = {
        x: titleRect.left,
        y: titleRect.top,
        width: titleRect.width,
        height: titleRect.height,
      };
      const c = {
        x: contentRect.left,
        y: contentRect.top,
        width: contentRect.width,
        height: contentRect.height,
      };
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.forEach((star) => {
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * 10 - 20;
        star.relocate(randomX, randomY, t, c);
      });
    });
    animate();
  };
  useEffect(() => {
    if (nakama) {
      getSpaces(nakama);
    }
    initCanvas();
  }, []);
  return (
    <>
      <div className="lobbyview">
        <div className="space_list">
          <h1 className="space_title">SPACES</h1>
          {/* <div>
            <button onClick={tryCreateMatch}>방 만들기</button>
          </div> */}
          <div className="space_body">
            {spaces.length > 0 ? (
              spaces.map((space, index) => (
                <div
                  key={`space_${index}`}
                  onClick={() => joinSpace(space.match_id)}
                  className="space_container"
                >
                  <div className="square">
                    <div className="content">
                      <div>{space.handler_name}</div>
                      <div>{space.size}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>현재 개설된 방이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
      <canvas className="lobby_canvas" ref={lobbyCanvas}></canvas>
    </>
  );
};

export default LobbyView;
