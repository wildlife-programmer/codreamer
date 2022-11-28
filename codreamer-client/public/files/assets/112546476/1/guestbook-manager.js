class GuestbookManager extends pc.ScriptType {
  initialize() {
    const app = this.app;

    this.pivots = app.root.findByTag("memo_pivot");

    app.on("guestbook#get", this.getGuestBook, this);

    app.on("destroy", () => {
      app.off("guestbook#get", this.getGuestBook, this);
    });
  }
  getGuestBook(guestbook) {
    console.log("guestbook", guestbook);
  }
}

pc.registerScript(GuestbookManager, "guestbookManager");
