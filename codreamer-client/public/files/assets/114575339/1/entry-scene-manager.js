class EntrySceneManager extends pc.ScriptType {
  initialize() {
    this.root = this.app.root.findByName("Root");
    this.app.fire("scene_init", this.sceneName);
    this.app.on("scene_change", this.changeScene, this);
    this.root.on("destroy", () => {
      console.log("destroyed");
      this.app.off("scene_change", this.changeScene, this);
    });
  }

  changeScene(targetName) {
    const assets = this.app.assets.findByTag(targetName);
    console.log(assets);
    let assetsLoad = 0;
    let assetsTotal = assets.length;

    const onAssetLoaded = () => {
      setTimeout(() => {
        this.app.scenes.loadSceneHierarchy(
          newScene,
          (err, loadedSceneRootEntity) => {
            if (err) {
              console.error(err);
            } else {
              oldHierarchy.destroy();
            }
          }
        );
      }, 3000);
    };

    const onAssetReady = (a) => {
      console.log("loaded", a);
      assetsLoad += 1;
      this.app.fire("loading", true, assetsTotal, assetsLoad);
      if (assetsLoad === assetsTotal) {
        onAssetLoaded();
      }
    };
    if (assets.length > 0) {
      for (let i = 0; i < assets.length; i++) {
        assets[i].ready(onAssetReady);
        this.app.assets.load(assets[i]);
      }
    } else {
      onAssetLoaded();
    }

    const newScene = this.app.scenes.find(targetName);
    const oldHierarchy = this.root;

    this.app.fire("loading", true, assetsTotal, assetsLoad);
  }
}

pc.registerScript(EntrySceneManager, "entrySceneManager");

EntrySceneManager.attributes.add("sceneName", { type: "string" });
