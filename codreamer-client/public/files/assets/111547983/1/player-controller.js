class PlayerController extends pc.ScriptType {
  initialize() {
    this.isLocalPlayer = false;
    this.app.on("localPlayer#init", this.initLocalPlayer, this);

    this.rigid = this.entity.rigidbody;
    this.moveDelta = new pc.Vec3();
  }
  initLocalPlayer() {
    this.isLocalPlayer = true;
  }
  update(dt) {
    if (!this.isLocalPlayer) return;
    let forceX = 0;
    let forceZ = 0;

    if (this.app.keyboard.isPressed(pc.KEY_W)) {
      forceZ -= 1;
    }
    if (this.app.keyboard.isPressed(pc.KEY_S)) {
      forceZ += 1;
    }
    if (this.app.keyboard.isPressed(pc.KEY_A)) {
      forceX -= 1;
    }
    if (this.app.keyboard.isPressed(pc.KEY_D)) {
      forceX += 1;
    }
    if (forceX !== 0 || forceZ !== 0) {
      const delta = this.moveDelta.set(forceX, 0, forceZ).scale(dt);

      const newPos = delta.add(this.entity.getPosition());
      this.rigid.teleport(newPos);
    }

    // .scale(0);
    // console.log(forceX, forceZ);
  }
}

pc.registerScript(PlayerController, "playerController");
