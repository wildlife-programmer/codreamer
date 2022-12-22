class HallGuestbookManager extends pc.ScriptType {
  initialize() {
    const app = this.app;
    this.root = this.app.root.findByTag("scene_hall")[0];
    this.pivots = this.root.findByTag("memo_pivot");
    app.on("guestbook#get", this.getGuestBook, this);

    this.root.on("destroy", () => {
      app.off("guestbook#get", this.getGuestBook, this);
    });
  }
  getGuestBook(data) {
    const guestbook = data.sort((a, b) => {
      return b.create_time - a.create_time;
    });
    let current_page;
    if (guestbook.length > 8) current_page = guestbook.slice(0, 8);
    else current_page = guestbook;
    current_page.forEach((memo, index) => {
      const memoInst = this.pivots[index];
      const memoObj = memoInst.findByTag("memo")[0];
      const name = memoObj.findByTag("name")[0];
      const time = memoObj.findByTag("time")[0];
      const message = memoObj.findByTag("message")[0];

      memoObj.enabled = true;
      name.element.text = memo.name;
      time.element.text = memo.date;
      message.element.text = memo.message;
    });
  }
}

pc.registerScript(HallGuestbookManager, "hallGuestbookManager");
