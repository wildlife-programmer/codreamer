class Ch1ObstacleController extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_chapter_1")[0];
    this.manager = this.app.root.findByTag("manager")[0];
    this.om = this.manager.script.ch1ObstacleManager;
    this.obstacleMap = this.om.obstacleMap;
  }
  update() {
    const pos = this.entity.getPosition();
    if (pos.y < -3) {
      this.obstacleMap.delete(this.entity._guid);
      this.entity.destroy();
    }
  }
}

pc.registerScript(Ch1ObstacleController, "ch1ObstacleController");
