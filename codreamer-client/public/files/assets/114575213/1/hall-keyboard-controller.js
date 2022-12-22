class HallKeyboardController extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_hall")[0];
    const app = this.app;

    this.inputTarget = null;
    this.playerCamera = null;
    this.cameraScript = null;
    this.speed = 60;
    this.move_able = true;

    this.force = new pc.Vec3();

    app.on("localPlayer#init", this.initInputTarget, this);

    if (app.keyboard) {
      app.keyboard.on("keydown", this.onKeyDown, this);
    }

    app.on("move#disable", this.handleMove, this);
    app.on("move#able", this.handleMove, this);

    this.root.on("destroy", () => {
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
    this.model = localPlayer.findByTag("model")[0];
    this.playerCamera = localPlayer.findByTag("camera")[0];
    this.cameraScript = this.playerCamera.script.cameraController;
  }

  update(dt) {
    if (!this.inputTarget || !this.move_able) return;
    const app = this.app;
    const anim = this.model.anim;
    const rigid = this.inputTarget.rigidbody;
    const isWalking = anim.getBoolean("walk");
    const worldDirection = HallKeyboardController.worldDirection;
    worldDirection.set(0, 0, 0);

    const tempDirection = HallKeyboardController.tempDirection;

    let forward = this.playerCamera.forward;
    forward.y = 0;
    let right = this.playerCamera.right;
    right.y = 0;

    let x = 0;
    let z = 0;

    if (app.keyboard.isPressed(pc.KEY_A)) x -= 1;
    if (app.keyboard.isPressed(pc.KEY_D)) x += 1;
    if (app.keyboard.isPressed(pc.KEY_W)) z += 1;
    if (app.keyboard.isPressed(pc.KEY_S)) z -= 1;

    if (x !== 0 || z !== 0) {
      // this.force.set(x, 0, z).normalize().scale(this.speed);
      // const nextPos = this.inputTarget.getPosition().clone().sub(this.force);
      // this.model.lookAt(nextPos);
      // rigid.applyForce(this.force);

      worldDirection.add(tempDirection.copy(forward).mulScalar(z));
      worldDirection.add(tempDirection.copy(right).mulScalar(x));
      worldDirection.normalize().scale(this.speed);
      const nextPos = this.inputTarget
        .getPosition()
        .clone()
        .sub(worldDirection);

      rigid.applyForce(worldDirection);
      this.model.lookAt(nextPos);

      // const pos = new pc.Vec3(worldDirection.x * dt, 0, worldDirection.z * dt);
      // pos.normalize().scale(this.speed);
      // pos.add(this.inputTarget.getPosition());

      // let targetY = this.cameraScript.eulers.x + 180;
      // let rot = new pc.Vec3(0, targetY, 0);

      // this.inputTarget.rigidbody.teleport(pos, rot);
      if (this.app.frame % 15 === 0) {
        const gm = this.app.gameManager;
        gm.sendPlayerMove(this.inputTarget.getPosition(), nextPos);
      }
      if (!isWalking) anim.setBoolean("walk", true);
    } else {
      if (isWalking) anim.setBoolean("walk", false);
    }
  }

  onKeyDown(ev) {
    if (!this.inputTarget) return;
    const gm = this.app.gameManager;
    if (this.inputTarget.canJump && ev.key === pc.KEY_SPACE) {
      this.inputTarget.canJump = false;
      gm.sendPlayerJump();
    }
  }
}
HallKeyboardController.worldDirection = new pc.Vec3();
HallKeyboardController.tempDirection = new pc.Vec3();

pc.registerScript(HallKeyboardController, "hallKeyboardController");
