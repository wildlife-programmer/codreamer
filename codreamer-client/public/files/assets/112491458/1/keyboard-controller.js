class KeyboardController extends pc.ScriptType {
  initialize() {
    const app = this.app;

    this.inputTarget = null;
    this.playerCamera = null;
    this.cameraScript = null;
    this.speed = 0.1;
    this.move_able = true;

    app.on("localPlayer#init", this.initInputTarget, this);

    if (app.keyboard) {
      app.keyboard.on("keydown", this.onKeyDown, this);
    }

    app.on("move#disable", this.handleMove, this);
    app.on("move#able", this.handleMove, this);

    this.on("destroy", () => {
      app.off("move#disable", this.handleMove, this);
      app.off("localPlayer#init", this.initInputTarget, this);

      if (app.keyboard) {
        app.keyboard.off("keydown", this.onKeyDown, this);
      }
    });
  }
  handleMove(bool) {
    this.move_able = bool;
  }
  initInputTarget(localPlayer) {
    this.inputTarget = localPlayer;
    this.playerCamera = localPlayer.findByTag("camera")[0];
    this.cameraScript = this.playerCamera.script.cameraController;
  }

  update(dt) {
    if (!this.inputTarget || !this.move_able) return;
    const app = this.app;
    const worldDirection = KeyboardController.worldDirection;
    worldDirection.set(0, 0, 0);

    const tempDirection = KeyboardController.tempDirection;

    let forward = this.inputTarget.forward;
    let right = this.inputTarget.right;

    let x = 0;
    let z = 0;

    if (app.keyboard.isPressed(pc.KEY_A)) x -= 1;
    if (app.keyboard.isPressed(pc.KEY_D)) x += 1;
    if (app.keyboard.isPressed(pc.KEY_W)) z += 1;
    if (app.keyboard.isPressed(pc.KEY_S)) z -= 1;

    if (x !== 0 || z !== 0) {
      worldDirection.add(tempDirection.copy(forward).mulScalar(z));
      worldDirection.add(tempDirection.copy(right).mulScalar(x));
      worldDirection.normalize();

      const pos = new pc.Vec3(worldDirection.x * dt, 0, worldDirection.z * dt);
      pos.normalize().scale(this.speed);
      pos.add(this.inputTarget.getPosition());

      let targetY = this.cameraScript.eulers.x + 180;
      let rot = new pc.Vec3(0, targetY, 0);

      this.inputTarget.rigidbody.teleport(pos, rot);
      if (this.app.frame % 15 === 0) {
        const gm = this.app.gameManager;
        gm.sendPlayerMove(pos);
      }
    }
  }

  onKeyDown(ev) {}
}
KeyboardController.worldDirection = new pc.Vec3();
KeyboardController.tempDirection = new pc.Vec3();

pc.registerScript(KeyboardController, "keyboardController");
