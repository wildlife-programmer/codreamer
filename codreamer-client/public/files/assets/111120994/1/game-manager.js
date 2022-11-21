const OP_PLAYER_SPAWN = 1;
class GameManager extends pc.ScriptType {
  initialize() {
    this.app.on("nakama#init", this.nakamaInit, this);
    this.app.on("player#spawn", this.sendPlayerSpawn, this);
    this.app.on("match#join", this.matchJoin, this);
    this.on("destroy", () => {
      this.app.off("nakama#init", this.nakamaInit, this);
      this.app.off("player#spawn", this.sendPlayerSpawn, this);
      this.app.off("match#join", this.matchJoin, this);
    });

    this._root = this.app.root;
  }
  update() {}

  nakamaInit(nakama) {
    if (!nakama) return;
    this.app.nakama = this.nakama = nakama;
    this.nakama.socket.onmatchpresence = this.onMatchPresence.bind(this);
    this.nakama.socket.onmatchdata = this.onMatchData.bind(this);
  }

  async matchJoin() {
    const result = await this.nakama.socket.rpc("match_create");
    console.log("payload", result);
    this.match_id = result.payload;
    const match = await this.nakama.socket.joinMatch(this.match_id);
    console.log("match");
    if (match) {
      this.app.fire("match#join_success");
      this.sendPlayerSpawn();
    }
  }

  onMatchPresence(joins) {
    if (joins.length > 0) {
      joins.forEach((join) => {});
    }
    console.log("onmatchpresence", joins);
  }
  onMatchData(message) {
    console.log("on match data", message);
    const op_code = message.op_code;
    const data = message.data;
    const decoded_data = new TextDecoder().decode(data);

    switch (op_code) {
      case OP_PLAYER_SPAWN:
        this.onPlayerSpawn(op_code, decoded_data);
        break;
      default:
        break;
    }
  }

  sendPlayerSpawn(match_id) {
    setTimeout(async () => {
      const account = await this.getAccount();
      console.log("account", account);
      await this.nakama.socket.sendMatchState(
        this.match_id,
        OP_PLAYER_SPAWN,
        JSON.stringify({})
      );
    }, 0);
  }

  async onPlayerSpawn(op_code, data) {
    const account = await this.getAccount();
    const user_id = account.user.id;
    if()
    console.log("account", account);
    const instance = this.player_template.resource.instantiate();
    this._root.addChild(instance);
  }
  async getAccount() {
    const account = await this.nakama.client.getAccount(this.nakama.session);
    return account;
  }
}

pc.registerScript(GameManager, "gameManager");

GameManager.attributes.add("player_camera", { type: "entity" });
GameManager.attributes.add("player_template", {
  type: "asset",
  assetType: "template",
});
