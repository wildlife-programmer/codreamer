class EntryGameManager extends pc.ScriptType {
  initialize() {
    const app = this.app;
    if (app.touch) {
      this.joystick.enabled = true;
    }

    this.on("destroy", () => {
      if (app.touch) {
        this.joystick.enabled = false;
      }
    });
  }
}

pc.registerScript(EntryGameManager, "entryGameManager");

EntryGameManager.attributes.add("joystick", { type: "entity" });
