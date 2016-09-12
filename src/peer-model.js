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
    this.sendMessage = data => {
      const reqData = Object.assign(data, {chat_id: this.id});
      api.sendMessage(reqData);
    };

    this.sendChatAction = action => {
      api.sendChatAction({
        chat_id: this.id,
        action
      });
    };

    this.forwardMessage = data => {
      const reqData = Object.assign(data, {
        from_chat_id: this.id,
      });
      api.forwardMessage(reqData);
    }

    this.clone = () => {
      return new this.constructor(api, this);
    }
  }
}

module.exports = Peer;