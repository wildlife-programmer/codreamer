class InputController extends pc.ScriptType {
  initialize() {
    this.inputTarget = null;
    this.app.on("inputTarget#init", this.onInitInputTarget, this);
  }

  onInitInputTarget(player) {
    this.inputTarget = player;
  }

  update() {
    if (!this.inputTarget) return;
    let forceX = 0;
    let forceZ = 0;

    if (this.app.keyboard.isPressed(pc.KEY_W)) {
      console.log("W preseed");
      forceZ -= 1;
    }
    if (this.app.keyboard.isPressed(pc.KEY_S)) {
      console.log("S preseed");
      forceZ += 1;
    }
    if (this.app.keyboard.isPressed(pc.KEY_A)) {
      console.log("A pressed");
      forceX -= 1;
    }
    if (this.app.keyboard.isPressed(pc.KEY_D)) {
      console.log("D preseed");
      forceX += 1;
    }

    console.log(forceX, forceZ);
  }
}

pc.registerScript(InputController, "inputController");
