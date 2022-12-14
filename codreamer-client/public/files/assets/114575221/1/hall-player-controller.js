class HallPlayerController extends pc.ScriptType {
  initialize() {
    this.isLocalPlayer = false;

    this.rigid = this.entity.rigidbody;
    this.model = this.entity.findByTag("model")[0];
    this.anim = this.model.anim;
    this.moveDelta = new pc.Vec3();
    this.speed = 10;
    this.speaker = this.entity.findByTag("speaker")[0];
    this.speaker_timer = null;

    this.entity.canJump = true;

    this.entity.on("move", this.onMove, this);
    this.entity.on("jump", this.onJump, this);
    this.entity.on("chat#speak", this.onChat, this);
    this.rigid.on("triggerenter", this.onTriggerEnter, this);
    this.rigid.on("collisionstart", this.onCollisionStart, this);

    this.targetPosition = new pc.Vec3();

    this.distance = new pc.Vec3();
    this.direction = new pc.Vec3();

    this.entity.on("destroy", () => {
      this.entity.off("move", this.onMove, this);
      this.entity.off("chat#speak", this.onChat, this);
      this.rigid.off("triggerenter", this.onTriggerEnter, this);
      this.rigid.off("collisionstart", this.onCollisionStart, this);
    });
    this.posAlpha = 0;
    this.temp = new pc.Vec3();
  }
  update(dt) {
    if (this.isMoving) {
      const isWalking = this.anim.getBoolean("walk");

      if (this.posAlpha > 1) return;
      this.posAlpha += dt;

      this.temp.lerp(this.entity.getPosition(), this.targetPosition, 0.1);

      this.distance.sub2(this.targetPosition, this.entity.getPosition());

      this.direction.copy(this.distance).normalize();

      if (this.distance.length() > 0.05) {
        this.rigid.teleport(
          // this.entity.getPosition().add(this.direction.scale(this.speed * dt))
          this.temp
        );
        if (!isWalking) this.anim.setBoolean("walk", true);
      } else {
        if (isWalking) this.anim.setBoolean("walk", false);
      }
    }
  }
  onMove(targetPosition, direction, ext) {
    if (ext) {
      this.targetPosition.copy(targetPosition);
      this.rigid.teleport(targetPosition);
      return;
    }
    this.posAlpha = 0;
    this.isMoving = true;
    this.targetPosition.copy(targetPosition);
    this.distance.sub2(targetPosition, this.entity.getPosition());
    if (this.distance.length() > 0.1) {
      this.model.lookAt(direction.x, this.model.getPosition().y, direction.z);
    }
  }
  onChat(message) {
    if (this.speaker_timer) clearTimeout(this.speaker_timer);

    this.speaker.enabled = true;
    this.speaker.element.text = this.chunkSubstr(message.content.message, 7);
    this.speaker_timer = setTimeout(() => {
      this.speaker.enabled = false;
      this.speaker.element.text = "";
    }, 3000);
  }
  chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }
    let lineBreaked = chunks.join(",").replaceAll(",", "\n");

    return lineBreaked;
  }
  onTriggerEnter(contact) {
    if (!this.isLocalPlayer) return;
    if (contact.tags.has("gamezone_1")) {
      this.app.fire("gamezone", 1);
    }
  }
  onCollisionStart(contact) {
    if (!this.isLocalPlayer) return;
    if (contact.other.tags.has("floor")) {
      this.entity.canJump = true;
    }
  }
  onJump() {
    this.rigid.applyImpulse(0, 30, 0);
    this.anim.setTrigger("jump");
  }
}

pc.registerScript(HallPlayerController, "hallPlayerController");
