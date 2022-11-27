const OP_WORLD_STATE = 1;
const OP_PLAYER_SPAWN = 2;
const OP_PLAYER_MOVE = 3;
class GameManager extends pc.ScriptType {
  initialize() {
    this.app.gameManager = this;
    this.app.on("nakama#init", this.nakamaInit, this);
    this.app.on("player#spawn", this.sendPlayerSpawn, this);
    this.app.on("match#join", this.matchJoin, this);
    this.app.on("chat#send", this.onSendChat, this);

    this.on("destroy", () => {
      this.app.off("nakama#init", this.nakamaInit, this);
      this.app.off("player#spawn", this.sendPlayerSpawn, this);
      this.app.off("match#join", this.matchJoin, this);
      this.app.off("chat#send", this.onSendChat, this);
    });

    this._root = this.app.root;
    this.playerMap = new Map();
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
    this.match_id = result.payload;
    const match = await this.nakama.socket.joinMatch(this.match_id);
    if (match) {
      this.app.fire("match#join_success");
      this.sendPlayerSpawn();
      const chat = await this.nakama.socket.joinChat(
        this.match_id,
        1,
        false,
        false
      );
      if (chat) {
        this.nakama.socket.onchannelmessage = this.onChannelMessage.bind(this);
        this.nakama.socket.onchannelpresence =
          this.onChannelPresence.bind(this);
      }
    }
  }

  onSendChat(message) {
    const messageData = { message: message };
    this.nakama.socket.writeChatMessage(`2...${this.match_id}`, messageData);
  }

  onMatchPresence(joins) {
    if (joins.length > 0) {
      joins.forEach((join) => {});
    }
  }
  onChannelMessage(message) {
    this.app.fire("chat#get", message);
  }

  onChannelPresence(message) {
    // console.log("onchannelPresence", message);
  }
  onMatchData(message) {
    const op_code = message.op_code;
    const data = message.data;
    const decoded_data = JSON.parse(new TextDecoder().decode(data));

    switch (op_code) {
      case OP_WORLD_STATE:
        this.onWorldState(op_code, decoded_data);
        break;
      case OP_PLAYER_SPAWN:
        this.onPlayerSpawn(op_code, decoded_data);
        break;
      case OP_PLAYER_MOVE:
        this.onPlayerMove(op_code, decoded_data);
        break;
      default:
        break;
    }
  }

  sendPlayerSpawn(match_id) {
    setTimeout(async () => {
      const account = await this.getAccount();
      await this.sendMatchState(OP_PLAYER_SPAWN, {});
    }, 0);
  }

  sendPlayerMove(pos) {
    setTimeout(async () => {
      await this.sendMatchState(OP_PLAYER_MOVE, { pos: this.float2int(pos) });
    }, 0);
  }

  float2int(pos) {
    if (pos instanceof pc.Vec3)
      return [
        Math.floor(pos.x * 10),
        Math.floor(pos.y * 10),
        Math.floor(pos.z * 10),
      ];
    else return pos;
  }

  int2float(pos) {
    if (Array.isArray(pos)) {
      return new pc.Vec3(pos[0] / 10, pos[1] / 10, pos[2] / 10);
    } else {
      return pos;
    }
  }

  async sendMatchState(op_code, data = {}) {
    setTimeout(async () => {
      await this.nakama.socket.sendMatchState(
        this.match_id,
        op_code,
        JSON.stringify(data)
      );
    }, 0);
  }
  async onWorldState(op_code, data) {
    const account = await this.getAccount();
    const user_id = account.user.id;
    const players = data.players;
    if (players.length > 0)
      players.forEach((player) => {
        if (player.user_id !== user_id) this.spawnPlayer(player.info, false);
      });
  }
  async onPlayerSpawn(op_code, data) {
    const account = await this.getAccount();
    const user_id = account.user.id;
    if (data.user_id === user_id) this.spawnPlayer(data, true);
    else this.spawnPlayer(data, false);
  }

  onPlayerMove(op_code, data) {
    const player = this.playerMap.get(data.user_id);
    if (!player) return;
    player.fire("move", this.int2float(data.pos));
  }

  spawnPlayer(playerInfo, self) {
    const instance = this.player_template.resource.instantiate();
    this.playerMap.set(playerInfo.user_id, instance);
    this._root.addChild(instance);
    if (playerInfo.pos)
      instance.fire("move", this.int2float(playerInfo.pos), true);
    if (self) {
      this.localPlayer = instance;
      this.localPlayer.camera = this.player_camera;
      this.localPlayer.addChild(this.player_camera);

      this.app.fire("localPlayer#init", instance);
    }
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
