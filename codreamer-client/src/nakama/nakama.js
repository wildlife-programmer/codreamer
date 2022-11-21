import { Client } from "@heroiclabs/nakama-js";

class Nakama {
  constructor() {
    this.client = new Client("defaultkey", "127.0.0.1", 7350);
    this.socket = this.client.createSocket();
    this.session = null;
  }

  async authenticateCustom(username) {
    this.session = await this.client.authenticateCustom(username);
    const response = await this.socket.connect(this.session, true);
    return response;
  }
}

export default Nakama;