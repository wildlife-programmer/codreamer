class EntryPlayerController extends pc.ScriptType {
  initialize() {
    this.rigid = this.entity.rigidbody;
    this.rigid.on("triggerenter", this.onTriggerEnter, this);
    this.on("destroy", () => {
      this.rigid.off("triggerenter", this.onTriggerEnter, this);
    });
  }

  onTriggerEnter(contact) {
    if (contact.tags.has("entry_portal")) this.app.fire("entry_portal");
  }
}

pc.registerScript(EntryPlayerController, "entryPlayerController");
