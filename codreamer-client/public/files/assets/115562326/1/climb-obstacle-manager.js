class ClimbObstacleManager extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("game_climb")[0];
    this.obstacleMap = new Map();
    this.root.on("destroy", () => {
      console.log("obstacles destroy");
    });

    this.isPlaying = true;
    this.tick = 0;
  }
  update(dt) {
    const obstacles = this.obstacleMap;
    const tick = this.tick;
    if (this.isPlaying && obstacles.size <= 20) {
      if (tick < 0.25) {
        this.tick += dt;
      } else {
        this.tick = 0;
        this.spawn();
      }
    }
  }
  spawn() {
    const obs = this.obstacle.resource.instantiate();
    this.obstacleMap.set(obs._guid, obs);
    const randomX = Math.floor((Math.random() * 8 - 4) * 10) / 10;
    obs.setPosition(randomX, 25, -45);
    this.root.addChild(obs);
    obs.rigidbody.teleport(randomX, 25, -45);
  }
  destroy() {
    const obstacles = this.obstacles;
    if (obstacles.length > 0) {
      obstacles.forEach((obstacle) => {
        obstacle.destroy();
      });
    }
    this.enabled = false;
  }
}

pc.registerScript(ClimbObstacleManager, "climbObstacleManager");

ClimbObstacleManager.attributes.add("obstacle", {
  type: "asset",
  assetType: "template",
});
