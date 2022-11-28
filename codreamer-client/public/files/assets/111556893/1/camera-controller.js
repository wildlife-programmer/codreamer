class CameraController extends pc.ScriptType {
  initialize() {
    this.eulers = new pc.Vec3();
    this.touchCoords = new pc.Vec2();

    const app = this.app;
    app.mouse.on("mousemove", this.onMouseMove, this);
    app.mouse.on("mousedown", this.onMouseDown, this);
    app.mouse.on("mouseup", this.onMouseUp, this);
    const parent = this.entity.parent;
    this.rayEnd = parent.findByTag("raycast_endpoint")[0];
    this.entity.cameraController = this;
    this.focusEntity = null;
    this.position = this.entity.position;
    this.isCameraMoving = false;
  }
  postUpdate(dt) {
    const originEntity = this.entity.parent;

    const targetY = this.eulers.x + 180;
    const targetX = this.eulers.y;

    const targetAngle = new pc.Vec3(-targetX, targetY, 0);

    originEntity.setEulerAngles(targetAngle);

    this.entity.setPosition(this.getWorldPoint());
    this.entity.lookAt(originEntity.getPosition());
    this.mouseSpeed = 6;
  }

  onMouseMove(e) {
    if (!this.isCameraMoving) return;
    const mouseController = this.app.mouseController;
    if (!mouseController.isCameraMoving) mouseController.isCameraMoving = true;
    // if (pc.Mouse.isPointerLocked()) {
    this.eulers.x -= ((this.mouseSpeed * e.dx) / 60) % 360;
    this.eulers.y += ((this.mouseSpeed * e.dy) / 60) % 360;

    if (this.eulers.x < 0) this.eulers.x += 360;
    if (this.eulers.y < 0) this.eulers.y += 360;
    // }
  }

  onMouseDown() {
    this.isCameraMoving = true;
    // this.app.mouse.enablePointerLock();
  }
  onMouseUp() {
    const mouseController = this.app.mouseController;
    if (mouseController.isCameraMoving) mouseController.isCameraMoving = false;
    this.isCameraMoving = false;
  }

  getWorldPoint() {
    const app = this.app;

    const from = this.entity.parent.getPosition();
    const to = this.rayEnd.getPosition();

    const hit = app.systems.rigidbody.raycastFirst(from, to);
    return hit ? hit.point : to;
  }
}

pc.registerScript(CameraController, "cameraController");
