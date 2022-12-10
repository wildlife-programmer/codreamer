import { Client } from "@heroiclabs/nakama-js";

class Nakama {
  constructor() {
    this.client = null;
    this.socket = null;
    this.session = null;
  }

  initialize(config) {
    if (!config) {
      config = {
        host: "localhost",
        port: "7350",
        serverkey: "defaultkey",
        useSSL: false,
      };
    }
    this.client = new Client(
      config.serverkey,
      config.host,
      config.port,
      config.useSSL,
      20000
    );
  }

  async authenticateCustom(username) {
    this.session = await this.client.authenticateCustom(username);
    return this.session;
  }

  async connect(useSSL, verbose, protobuf, cb) {
    this.connectParams = {
      useSSL,
      verbose,
      protobuf,
      cb: cb,
    };
    try {
      this.socket = this.client.createSocket(useSSL, verbose);
      await this.socket.connect(this.session, true);
    } catch (err) {}
  }

  async getAccount() {
    if (!this.client || !this.session) return;
    const account = await this.client.getAccount(this.session);
    return account;
  }
}

export default Nakama;
