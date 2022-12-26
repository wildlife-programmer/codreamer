export default class SCG {
  constructor(mode) {
    this.end = mode * mode;
    this.cursor = 1;

    this.isStarted = false;
  }

  check(number) {
    if (this.cursor === this.end) {
      return -1;
    }
    console.log(this.cursor, number, this.end);
    if (this.cursor === number) {
      const dom = document.querySelector(`.scg_${number}`);
      dom.classList.add("checked");
      this.cursor += 1;
    }
    return this.cursor;
  }

  start() {
    this.isStarted = true;
  }

  finish(nakama, stage, time) {
    this.isStarted = false;
    this.cursor = 1;
    console.log(time, stage);
    if (nakama) {
      (async () => {
        const result = await nakama.socket.rpc(
          "set_leaderboard",
          JSON.stringify({ game: "speed_click", record: time, stage: stage })
        );
        console.log(result);
      })();
    }
  }
}
