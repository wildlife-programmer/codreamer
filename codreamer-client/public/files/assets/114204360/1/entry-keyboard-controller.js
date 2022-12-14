class EntryKeyboardController extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_entry")[0];
    this.force = new pc.Vec3(0, 0, 0);
    this.speed = 60;

    this.player.canJump = true;
    this.rigid = this.player.rigidbody;
    this.model = this.player.findByTag("model")[0];
    this.temp = new pc.Vec3();

    if (this.app.keyboard) {
      this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    }
    this.root.on("destroy", () => {
      if (this.app.keyboard) {
        this.app.keyboard.off(pc.EVENT_KEYDOWN, this.onKeyDown, this);
      }
    });
  }
  update() {
    const rigid = this.rigid;
    const app = this.app;
    const anim = this.model.anim;
    const isWalking = anim.getBoolean("walk");
    let x = 0;
    let z = 0;

    if (app.keyboard.isPressed(pc.KEY_W)) z -= 1;
    if (app.keyboard.isPressed(pc.KEY_S)) z += 1;
    if (app.keyboard.isPressed(pc.KEY_A)) x -= 1;
    if (app.keyboard.isPressed(pc.KEY_D)) x += 1;

    if (x !== 0 || z !== 0) {
      this.force.set(x, 0, z).normalize().scale(this.speed);
      const nextPos = this.entity.getPosition().clone().sub(this.force);
      this.model.lookAt(nextPos);
      rigid.applyForce(this.force);
      if (!isWalking) anim.setBoolean("walk", true);
    } else {
      if (isWalking) anim.setBoolean("walk", false);
    }
  }
  onKeyDown(ev) {
    if (this.player.canJump && ev.key === pc.KEY_SPACE) {
      this.player.canJump = false;
      this.rigid.applyImpulse(0, 30, 0);
      this.model.anim.setTrigger("jump");
    }
  }
}

pc.registerScript(EntryKeyboardController, "entryKeyboardController");

EntryKeyboardController.attributes.add("player", { type: "entity" });
