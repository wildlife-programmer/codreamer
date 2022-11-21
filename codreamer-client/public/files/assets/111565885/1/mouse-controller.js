class MouseController extends pc.ScriptType {
  initialize() {
    this.inputTarget = null;
    this.app.on("localPlayer#init", this.initInputTarget, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
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
    if (result.entity.tags.has("player")) {
      result.point.y = 0;
    }
    this.inputTarget.fire("move", result.point);
    const gm = this.app.gameManager;
    gm.sendPlayerMove(result.point);
  }
}

pc.registerScript(MouseController, "mouseController");