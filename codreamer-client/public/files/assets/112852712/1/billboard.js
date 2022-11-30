class Billboard extends pc.ScriptType {
  initialze() {}
  update(dt) {
    const localPlayer = this.app.gameManager.localPlayer;
    if (!localPlayer) return;
    const camera = localPlayer.camera;
    this.entity.setRotation(camera.getRotation());
  }
}

pc.registerScript(Billboard, "billboard");
