class PlayerController extends pc.ScriptType {
  initialize() {
    this.isLocalPlayer = false;

    this.rigid = this.entity.rigidbody;
    this.model = this.entity.findByTag("model")[0];
    this.moveDelta = new pc.Vec3();
    this.speed = 3;

    this.entity.on("move", this.onMove, this);
    this.targetPosition = new pc.Vec3();

    this.distance = new pc.Vec3();
    this.direction = new pc.Vec3();
  }
  update(dt) {
    this.distance.sub2(this.targetPosition, this.entity.getPosition());

    this.direction.copy(this.distance).normalize();

    if (this.distance.length() > 0.1) {
      this.rigid.teleport(
        this.entity.getPosition().add(this.direction.scale(5 * dt))
      );
    }
  }
  onMove(targetPosition) {
    this.targetPosition.copy(targetPosition);
    this.distance.sub2(targetPosition, this.entity.getPosition());
    if (this.distance.length() > 0.1) {
      this.model.lookAt(
        this.targetPosition.x,
        this.model.getPosition().y,
        this.targetPosition.z
      );
    }
  }
}

pc.registerScript(PlayerController, "playerController");
