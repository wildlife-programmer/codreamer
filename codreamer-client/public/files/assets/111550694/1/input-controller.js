class InputController extends pc.ScriptType {
  initialize() {
    this.inputTarget = null;
  }

  update() {
    if (!this.inputTarget) return;
  }
}

pc.registerScript(InputController, "inputController");
