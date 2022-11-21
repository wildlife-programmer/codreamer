class PlayerController extends pc.ScriptType {
  initialize() {
    this.isLocalPlayer = false;
    this.app.on("localPlayer#init", this.initLocalPlayer, this);

    this.rigid = this.entity.rigidbody;
    this.moveVector = new pc.Vec3();
  }
  initLocalPlayer() {
    this.isLocalPlayer = true;
  }
  update() {
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

    const vector = this.moveVector.set(forceX, 0, forceZ).normalize();
    // .scale(0);
    this.rigid.applyForce(vector.scale(5));
    // console.log(forceX, forceZ);
  }
}

pc.registerScript(PlayerController, "playerController");
