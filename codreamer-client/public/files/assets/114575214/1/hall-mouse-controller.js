class HallMouseController extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_hall")[0];
    const app = this.app;
    app.mouseController = this;
    this.inputTarget = null;
    app.on("localPlayer#init", this.initInputTarget, this);
    if (app.mouse) {
      app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    }

    this.isCameraMoving = false;
    this.root.on("destroy", () => {
      if (app.mouse) {
        app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
      }
    });
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
      const tags = result.entity.tags;
      if (tags.has("guestbook")) {
        this.app.fire("guestbook", true);
        this.app.fire("move#disable", false);
      }
      if (tags.has("gamezone_2")) this.app.fire("gamezone", 2);
      if (tags.has("contributor")) {
      }
      if (tags.has("proposal")) {
      }
    }
  }
}

pc.registerScript(HallMouseController, "hallMouseController");
