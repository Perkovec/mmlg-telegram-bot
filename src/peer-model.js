class Peer {
  constructor(api, peer) {
    this.id = peer.id;
    this.first_name = peer.first_name;
    this.last_name = peer.last_name;
    this.username = peer.username;
    this.type = peer.type || null;

    this._registerMethods(api);
  }

  _registerMethods(api) {
    this.sendMessage = text => {
      api.sendMessage(this.id, text);
    };
  }
}

module.exports = Peer;