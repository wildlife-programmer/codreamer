class Ch1PlayerController extends pc.ScriptType {
  initialize() {
    this.rigid = this.entity.rigidbody;

    this.rigid.on("triggerenter", this.onTriggerEnter, this);
  }

  update() {}

  onTriggerEnter(contact) {
    if (contact.tags.has("goal")) {
      contact.enabled = false;
      this.app.ch1_gm.state = END;
    }
  }
}

pc.registerScript(Ch1PlayerController, "ch1PlayerController");
