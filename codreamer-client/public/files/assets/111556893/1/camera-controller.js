class CameraController extends pc.ScriptType {
  initialize() {
    this.entity.cameraController = this;
    this.focusEntity = null;
    this.position = this.entity.position;
  }
  update(dt) {
    if (!this.focusEntity) return;
    this.focus(this.focusEntity, dt);
  }

  focus(target, dt) {
    // const targetPosition = target.getPosition();
    // const nextPosition = this.position.add(targetPosition).scale(dt);
    // this.entity.setPosition(nextPosition);
  }
}

pc.registerScript(CameraController, "cameraController");
