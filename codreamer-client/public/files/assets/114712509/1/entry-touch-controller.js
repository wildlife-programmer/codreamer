class EntryTouchController extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_entry")[0];
    this.eulers = new pc.Vec3();
    this.app.touchController = this;
    this.touchSpeed = 3;
    this._initposition = this.entity.getPosition().clone();
    this.maxRadius = 80;

    this.screenLeft = this.app.root.findByTag("screen_left")[0].element;
    this.lastTouchPoint = new pc.Vec2();
    this.model = this.player.findByTag("model")[0];
    this.rigid = this.player.rigidbody;
    if (this.app.touch) {
      this.screenLeft.on(pc.EVENT_TOUCHSTART, this.onLeftTouchStart, this);
      this.screenLeft.on(pc.EVENT_TOUCHMOVE, this.onLeftTouchMove, this);
      this.screenLeft.on(pc.EVENT_TOUCHEND, this.onLeftTouchEnd, this);
    }
    this.root.on("destroy", () => {
      if (this.app.touch) {
        this.screenLeft.off(pc.EVENT_TOUCHSTART, this.onLeftTouchStart, this);
        this.screenLeft.off(pc.EVENT_TOUCHMOVE, this.onLeftTouchMove, this);
        this.screenLeft.off(pc.EVENT_TOUCHEND, this.onLeftTouchEnd, this);
      }
    });
    this.delta = new pc.Vec2();
    this.startPoint = new pc.Vec2();
    this.stick = this.entity.findByTag("stick")[0];
    this.nextPosition = new pc.Vec3();

    this.screen = this.app.root.findByTag("screen")[0];
    this.scale = this.screen.screen.scale;

    this.force = new pc.Vec3();
    this.speed = 60;
  }

  update(dt) {
    const rigid = this.rigid;
    const anim = this.model.anim;
    const isWalking = anim.getBoolean("walk");

    const min = this.maxRadius * 0.7;
    let x = 0;
    let z = 0;

    if (this.delta.x > min) x += 1;
    if (this.delta.x < -min) x -= 1;
    if (this.delta.y > min) z -= 1;
    if (this.delta.y < -min) z += 1;

    if (x !== 0 || z !== 0) {
      this.force.set(x, 0, z).normalize().scale(this.speed);
      const nextPos = this.player.getPosition().clone().sub(this.force);
      this.model.lookAt(nextPos);
      rigid.applyForce(this.force);
      if (!isWalking) anim.setBoolean("walk", true);
    } else {
      if (isWalking) anim.setBoolean("walk", false);
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

pc.registerScript(EntryTouchController, "entryTouchController");

EntryTouchController.attributes.add("player", { type: "entity" });
