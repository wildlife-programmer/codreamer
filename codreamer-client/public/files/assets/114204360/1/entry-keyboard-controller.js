class EntryKeyboardController extends pc.ScriptType {
    initialize() {
        this.force = new pc.Vec3(0, 0, 0);
        this.speed = 40;
        this.rigid = this.player.rigidbody;
        this.model = this.player.findByTag("model")[0];
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
            if (!isWalking) anim.setBoolean('walk', true);
        } else {
            if (isWalking) anim.setBoolean('walk', false);
        }
    }
}

pc.registerScript(EntryKeyboardController, "entryKeyboardController");

EntryKeyboardController.attributes.add("player", { type: 'entity' });