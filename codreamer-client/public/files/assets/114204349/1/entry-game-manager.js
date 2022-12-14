class EntryGameManager extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_entry")[0];
    const manager = this.root.findByTag("manager")[0];
    const app = this.app;
    if (app.touch) {
      this.joystick.enabled = true;
    } else {
      manager.script.entryKeyboardController.enabled = true;
    }

    this.root.on("destroy", () => {
      if (app.touch) {
        this.joystick.enabled = false;
      }
    });
  }
}

pc.registerScript(EntryGameManager, "entryGameManager");

EntryGameManager.attributes.add("joystick", { type: "entity" });
