class Ch1KeyboardController extends pc.ScriptType {
    initialize() {
        this.force = new pc.Vec3(0, 0, 0);
        this.speed = 10;
        this.rigid = this.player.rigidbody;
    }

    update() {
        const rigid = this.rigid;
        const app = this.app;
        let x = 0;
        let z = 0;

        if (app.keyboard.isPressed(pc.KEY_W)) z -= 1;
        if (app.keyboard.isPressed(pc.KEY_S)) z += 1;
        if (app.keyboard.isPressed(pc.KEY_A)) x -= 1;
        if (app.keyboard.isPressed(pc.KEY_D)) x += 1;

        if (x !== 0 || z !== 0) {
            this.force.set(x, 0, z).normalize().scale(this.speed);
            rigid.applyForce(this.force);
        }
    }
}

pc.registerScript(Ch1KeyboardController, "ch1KeyboardController");

Ch1KeyboardController.attributes.add("player", { type: 'entity' })