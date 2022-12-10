class HallTouchController extends pc.ScriptType {
  initialize() {
    this.eulers = new pc.Vec3();
    this.app.touchController = this;
    this.inputTarget = null;
    this.touchSpeed = 3;
    this._initposition = this.entity.getPosition().clone();

    this.app.on("localPlayer#init", this.onInitInputTarget, this);

    this.screenLeft = this.app.root.findByTag("screen_left")[0].element;
    this.screenRight = this.app.root.findByTag("screen_right")[0].element;
    this.lastTouchPoint = new pc.Vec2();

    if (this.app.touch) {
      this.screenLeft.on(pc.EVENT_TOUCHSTART, this.onLeftTouchStart, this);
      this.screenLeft.on(pc.EVENT_TOUCHMOVE, this.onLeftTouchMove, this);
      this.screenLeft.on(pc.EVENT_TOUCHEND, this.onLeftTouchEnd, this);
      this.screenRight.on("touchstart", this.onRightTouchStart, this);
      this.screenRight.on("touchmove", this.onRightTouchMove, this);
      this.screenRight.on("touchend", this.onRightTouchEnd, this);
    }
    this.on("destroy", () => {
      this.app.off("localPlayer#init", this.onInitInputTarget, this);
      if (this.app.touch) {
        this.screenLeft.off(pc.EVENT_TOUCHSTART, this.onLeftTouchStart, this);
        this.screenLeft.off(pc.EVENT_TOUCHMOVE, this.onLeftTouchMove, this);
        this.screenLeft.off(pc.EVENT_TOUCHEND, this.onLeftTouchEnd, this);
        this.screenRight.off("touchstart", this.onRightTouchStart, this);
        this.screenRight.off("touchmove", this.onRightTouchMove, this);
        this.screenRight.off("touchend", this.onRightTouchEnd, this);
      }
    });
    this.delta = new pc.Vec2();
    this.startPoint = new pc.Vec2();
    this.stick = this.entity.findByTag("stick")[0];
    this.nextPosition = new pc.Vec3();

    this.screen = this.app.root.findByTag("screen")[0];
    this.scale = this.screen.screen.scale;

    this.maxRadius = 80;
    this.speed = 0.1;
    this.isCameraMoving = false;
    this.app.on("fpv", this.onFpv, this);
    this.fpv = false;
  }

  onInitInputTarget(player) {
    this.inputTarget = player;
    this.playerCamera = player.findByTag("camera")[0];
    this.cameraScript = this.playerCamera.script.cameraController;
    const parent = this.playerCamera.parent;
    this.fpvPivot = parent.findByTag("first_person")[0];
    this.rayEnd = parent.findByTag("raycast_endpoint")[0];
  }
  postUpdate(dt) {
    if (!this.inputTarget) return;
    const originEntity = this.playerCamera.parent;
    const targetY = this.eulers.x + 180;
    const targetX = this.eulers.y;

    const targetAngle = new pc.Vec3(-targetX, targetY, 0);

    originEntity.setEulerAngles(targetAngle);

    this.playerCamera.setPosition(this.getWorldPoint(this.playerCamera));
    !this.fpv && this.playerCamera.lookAt(originEntity.getPosition());
  }

  update(dt) {
    if (!this.inputTarget) return;
    const min = this.maxRadius * 0.7;
    const worldDirection = HallTouchController.worldDirection;
    worldDirection.set(0, 0, 0);

    const tempDirection = HallTouchController.tempDirection;
    let x = 0;
    let z = 0;
    let forward = this.inputTarget.forward;
    let right = this.inputTarget.right;

    if (this.delta.x > min) x = 1;
    if (this.delta.x < -min) x = -1;
    if (this.delta.y > min) z = 1;
    if (this.delta.y < -min) z = -1;
    if (x !== 0 || z !== 0) {
      worldDirection.add(tempDirection.copy(forward).mulScalar(z));
      worldDirection.add(tempDirection.copy(right).mulScalar(x));
      worldDirection.normalize();

      const pos = new pc.Vec3(worldDirection.x * dt, 0, worldDirection.z * dt);
      pos.normalize().scale(this.speed);
      pos.add(this.inputTarget.getPosition());

      let targetY = this.eulers.x + 180;
      let rot = new pc.Vec3(0, targetY, 0);

      this.inputTarget.rigidbody.teleport(pos, rot);
      if (this.app.frame % 15 === 0) {
        const gm = this.app.gameManager;
        gm.sendPlayerMove(pos);
      }
    }
  }

  onLeftTouchStart(ev) {
    const height = this.screenLeft.height * this.scale;

    const screenX = ev.x / this.scale;
    const screenY = (height - ev.y) / this.scale;

    this.startPoint.set(ev.x, ev.y);
    this.entity.setLocalPosition(screenX, screenY, 0);
  }
  onLeftTouchMove(ev) {
    const touch = ev.touches[0];
    let dx = (ev.x - this.startPoint.x) / this.scale;
    let dy = (this.startPoint.y - ev.y) / this.scale;

    const radius = Math.sqrt(dx * dx + dy * dy);
    if (radius > this.maxRadius) {
      const percentage = radius / this.maxRadius;
      dx /= percentage;
      dy /= percentage;
    }
    this.delta.set(dx, dy);
    this.stick.setLocalPosition(dx, dy, 0);
  }
  onLeftTouchEnd(ev) {
    this.delta.set(0, 0);
    this.entity.setPosition(this._initposition);
    this.stick.setLocalPosition(0, 0, 0);
  }

  onRightTouchStart(e) {
    this.lastTouchPoint.set(e.x, e.y);
    this.isCameraMoving = true;
  }
  onRightTouchMove(e) {
    const dx = e.x - this.lastTouchPoint.x;
    const dy = e.y - this.lastTouchPoint.y;
    console.log(dx, dy);
    const clampX = pc.math.clamp(dx, -30, 30);
    const clampY = pc.math.clamp(dy, -30, 30);
    if (!this.isCameraMoving) return;
    // const mouseController = this.app.mouseController;
    // if (!mouseController.isCameraMoving) mouseController.isCameraMoving = true;
    // if (pc.Mouse.isPointerLocked()) {
    this.eulers.x -= ((this.touchSpeed * clampX) / 60) % 360;
    this.eulers.y += ((this.touchSpeed * clampY) / 60) % 360;

    if (this.eulers.x < 0) this.eulers.x += 360;
    if (this.eulers.y < 0) this.eulers.y += 360;
  }
  onRightTouchEnd() {
    // const mouseController = this.app.mouseController;
    // if (mouseController.isCameraMoving) mouseController.isCameraMoving = false;
    this.isCameraMoving = false;
  }
  getWorldPoint(camera) {
    const to = this.fpv
      ? this.fpvPivot.getPosition()
      : this.rayEnd.getPosition();

    return to;
  }
  onFpv(bool) {
    this.fpv = bool;
  }
}
HallTouchController.worldDirection = new pc.Vec3();
HallTouchController.tempDirection = new pc.Vec3();

pc.registerScript(HallTouchController, "hallTouchController");
