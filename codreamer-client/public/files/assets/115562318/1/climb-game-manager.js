const IDLE = 1;
const READY = 2;
const PLAY = 3;
const END = 4;
class ClimbGameManager extends pc.ScriptType {
  #game_id = "";
  initialize() {
    this.root = this.app.root.findByTag("game_climb")[0];
    this.screen = this.root.findByTag("climb_screen")[0];

    if (window.location.host === "launch.playcanvas.com") {
      this.screen.enabled = true;
      this.startButton.element.on("click", this.handleStart, this);
    }
    this.manager = this.root.findByTag("manager")[0];
    this.app.climb_gm = this;

    this.fence = this.root.findByTag("fence")[0];
    this.goal = this.root.findByTag("goal")[0];
    this.om = this.manager.script.climbObstacleManager;

    this.state = IDLE;
    this.time = 0;
    this.my_record = 0;

    this.isPlaying = false;
    this.app.on("climb#start", this.handleStart, this);
    this.app.on("climb#validation", this.handleValidation, this);
    this.root.on("destroy", () => {
      this.app.off("climb#start", this.handleStart, this);
      this.app.off("climb#validation", this.handleValidation, this);
    });
  }
  handleStart() {
    // this.startButton.enabled = false;
    this.state = READY;
  }
  handleValidation(nkm, game_id, record) {
    if (this.#game_id !== game_id || !game_id) return;
    this.#game_id = "";
    nkm.socket.rpc("climb_set_record", JSON.stringify({ record: record }));
  }

  update(dt) {
    const state = this.state;

    let time = this.time;

    if (state === READY) {
      if (time > 3) {
        this.state = PLAY;
        this.isPlaying = true;
        this.time = 0;
        this.fence.enabled = false;
        this.#setGameId(this.#generateId(12));
      } else {
        this.time += dt;
      }
    } else if (state === PLAY) {
      this.om.enabled = true;
      this.time += dt;
    } else if (state === END) {
      if (this.isPlaying) {
        this.om.enabled = false;
        this.my_record = this.time;
        this.time = 0;
        this.isPlaying = false;
        this.#sendRecord(this.my_record);
      } else {
        if (time > 10) {
          this.app.fire("climb#finish");
          this.fence.enabled = true;
          this.goal.enabled = true;
          this.player.rigidbody.teleport(0, 0, 0);
          this.startButton.enabled = true;
          this.state = IDLE;
          this.time = 0;
          this.my_record = 0;
        } else this.time += dt;
      }
    }
  }
  #setGameId(game_id) {
    this.#game_id = game_id;
    this.app.fire("climb#game_id", game_id);
  }
  #sendRecord() {
    if (this.#game_id === "") return;
    this.app.fire("climb#record", this.my_record);
  }
  #generateId(L) {
    return [...Array(L)].map(() => Math.random().toString(36)[3]).join("");
  }
}

pc.registerScript(ClimbGameManager, "climbGameManager");

ClimbGameManager.attributes.add("player", { type: "entity" });
ClimbGameManager.attributes.add("startButton", { type: "entity" });
