const OP_WORLD_STATE = 1;
const OP_PLAYER_SPAWN = 2;
const OP_PLAYER_MOVE = 3;
const OP_PLAYER_JUMP = 4;
class HallGameManager extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_hall")[0];
    this.app.graphicsDevice.maxPixelRatio *= 2;
    const app = this.app;
    app.gameManager = this;
    app.on("nakama_init", this.onNakamaInit, this);
    app.on("match#join_success", this.matchJoin, this);
    app.on("chat#speak", this.onChatSpeak, this);
    if (app.touch) {
      this.joystick.enabled = true;
    }
    this.root.on("destroy", () => {
      app.off("nakama_init", this.onNakamaInit, this);
      app.off("match#join_success", this.matchJoin, this);
      app.off("chat#speak", this.onChatSpeak, this);
      if (app.touch) {
        this.joystick.enabled = false;
      }
    });

    this.playerMap = new Map();
    app.fire("nakama_request");
  }

  onNakamaInit(nakama) {
    if (!nakama) return;
    this.app.nakama = this.nakama = nakama;
    this.nakama.socket.onmatchpresence = this.onMatchPresence.bind(this);
    this.nakama.socket.onmatchdata = this.onMatchData.bind(this);
  }

  matchJoin(match_id) {
    this.match_id = match_id;
  }

  onChatSpeak(message) {
    const player = this.playerMap.get(message.sender_id);
    if (!player) return;

    player.fire("chat#speak", message);
  }

  // onSendChat(message) {
  //   const messageData = { message: message };
  //   this.nakama.socket.writeChatMessage(`2...${this.match_id}`, messageData);
  // }

  onMatchPresence(ev) {
    const leaves = ev.leaves;
    if (leaves && leaves.length > 0) {
      leaves.forEach((leave) => {
        const player = this.playerMap.get(leave.user_id);
        if (player) player.destroy();
      });
    }
  }
  onMatchData(message, match_id) {
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
      case OP_PLAYER_JUMP:
        this.onPlayerJump(op_code, decoded_data);
        break;
      default:
        break;
    }
  }

  sendPlayerSpawn(match_id) {
    setTimeout(async () => {
      await this.sendMatchState(OP_PLAYER_SPAWN, {});
    }, 0);
  }

  sendPlayerMove(pos, direction, ext = false) {
    setTimeout(async () => {
      await this.sendMatchState(OP_PLAYER_MOVE, {
        pos: this.float2int(pos),
        direction: this.float2int(direction),
        ext: ext,
      });
    }, 0);
  }

  sendPlayerJump() {
    setTimeout(async () => {
      await this.sendMatchState(OP_PLAYER_JUMP, {});
    }, 0);
  }

  float2int(pos) {
    if (pos instanceof pc.Vec3)
      return [
        Math.floor(pos.x * 1000),
        Math.floor(pos.y * 1000),
        Math.floor(pos.z * 1000),
      ];
    else return pos;
  }

  int2float(pos) {
    if (Array.isArray(pos)) {
      return new pc.Vec3(pos[0] / 1000, pos[1] / 1000, pos[2] / 1000);
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
    this.sendPlayerSpawn();
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
    if (data.user_id === user_id) {
      this.spawnPlayer(data, true);
      this.app.fire("loading", false);
    } else this.spawnPlayer(data, false);
  }

  onPlayerMove(op_code, data) {
    const player = this.playerMap.get(data.user_id);

    if (!player || player === this.localPlayer) return;
    player.fire(
      "move",
      this.int2float(data.pos),
      this.int2float(data.direction),
      data.ext
    );
  }
  onPlayerJump(op_code, data) {
    const player = this.playerMap.get(data.user_id);
    if (!player) return;
    player.fire("jump");
  }

  spawnPlayer(playerInfo, self) {
    const instance = this.player_template.resource.instantiate();
    this.playerMap.set(playerInfo.user_id, instance);
    this.root.addChild(instance);
    if (playerInfo.pos)
      instance.fire("move", this.int2float(playerInfo.pos), true);
    if (self) {
      this.localPlayer = instance;
      const playerController = this.localPlayer.script.hallPlayerController;
      playerController.isLocalPlayer = true;
      const camera = this.localPlayer.findByTag("camera")[0];
      this.localPlayer.camera = camera;
      camera.enabled = true;

      this.app.fire("localPlayer#init", instance);
    }
  }
  async getAccount() {
    const account = await this.nakama.client.getAccount(this.nakama.session);
    return account;
  }
}

pc.registerScript(HallGameManager, "hallGameManager");

HallGameManager.attributes.add("player_template", {
  type: "asset",
  assetType: "template",
});
HallGameManager.attributes.add("joystick", { type: "entity" });
