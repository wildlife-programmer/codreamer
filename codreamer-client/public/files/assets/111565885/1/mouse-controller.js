class MouseController extends pc.ScriptType {
  initialize() {
    const app = this.app;
    app.mouseController = this;
    this.inputTarget = null;
    app.on("localPlayer#init", this.initInputTarget, this);
    app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

    this.isCameraMoving = false;
  }

  onMouseDown(ev) {
    if (!this.inputTarget) return;

    this.raycast(ev);
  }

  initInputTarget(target) {
    this.inputTarget = target;
  }

  raycast(ev) {
    const cameraEntity = this.inputTarget.camera;
    const camera = cameraEntity.camera;
    const from = camera.screenToWorld(ev.x, ev.y, camera.nearClip);
    const to = camera.screenToWorld(ev.x, ev.y, camera.farClip);

    const result = this.app.systems.rigidbody.raycastFirst(from, to);
    if (result) {
      if (result.entity.tags.has("guestbook")) {
        this.app.fire("guestbook", true);
        this.app.fire("move#disable", false);
      }
      if (result.entity.tags.has("contributor")) {
      }
      if (result.entity.tags.has("proposal")) {
      }
    }
  }
}

pc.registerScript(MouseController, "mouseController");
