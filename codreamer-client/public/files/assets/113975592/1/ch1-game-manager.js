const IDLE = 1;
const READY = 2;
const PLAY = 3;
const END = 4;
class Ch1GameManager extends pc.ScriptType {
    initialize() {
        this.manager = this.app.root.findByTag("manager")[0];
        this.app.ch1_gm = this;

        this.om = this.manager.script.ch1ObstacleManager;

        this.state = IDLE;
        this.time = 0;
        this.my_record = 0;

        this.isPlaying = false;

        this.startButton.element.on("click", this.handleStart, this);
    }
    handleStart() {
        this.startButton.enabled = false;
        this.state = READY;
    }

    update(dt) {
        const state = this.state;

        let time = this.time;

        if (state === READY) {
            if (time > 3) {
                this.state = PLAY;
                this.isPlaying = true;
                this.time = 0;
            } else {
                this.time += dt;
            }
        } else if (state === PLAY) {
            this.om.enabled = true;
            this.time += dt;
        } else if (state === END) {
            if (this.isPlaying) {
                this.om.enabled = false;
                this.my_record = this.time;
                console.log(this.my_record);
                this.time = 0;
                this.isPlaying = false;
            } else {
                if (time > 10) {
                    this.player.rigidbody.teleport(0, 0, 0);
                    this.startButton.enabled = true;
                    this.state = IDLE;
                }
                else
                    this.time += dt;
            }
        }
    }
}

pc.registerScript(Ch1GameManager, "ch1GameManager");

Ch1GameManager.attributes.add("player", { type: 'entity' });
Ch1GameManager.attributes.add("startButton", { type: 'entity' });