class Ch1GoalController extends pc.ScriptType {
  initialize() {
      this.model = this.entity.findByTag("goal_model")[0];
  }
  update(dt) {
      this.model.rotateLocal(0, dt * 100, 0);
  }
}

pc.registerScript(Ch1GoalController, "ch1GoalController");
