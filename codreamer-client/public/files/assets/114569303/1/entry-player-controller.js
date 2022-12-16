class EntryPlayerController extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByTag("scene_entry")[0];
    this.rigid = this.entity.rigidbody;
    this.rigid.on("triggerenter", this.onTriggerEnter, this);
    this.rigid.on("collisionstart", this.onCollisionStart, this);
    this.root.on("destroy", () => {
      this.rigid.off("triggerenter", this.onTriggerEnter, this);
      this.rigid.off("collisionstart", this.onCollisionStart, this);
    });
  }

  onTriggerEnter(contact) {
    if (contact.tags.has("entry_portal")) this.app.fire("entry_portal");
  }

  onCollisionStart(contact) {
    if (contact.other.tags.has("floor")) this.entity.canJump = true;
  }
}

pc.registerScript(EntryPlayerController, "entryPlayerController");
