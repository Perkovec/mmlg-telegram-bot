const Peer = require('./peer-model');

class Message {
  constructor(api, msg) {
    this.message_id = msg.message_id;
    this.from = new Peer(api, msg.from);
    this.chat = new Peer(api, msg.chat);
    this.date = msg.date;
    this.text = msg.text;

    this._registerMethods(api);
  }

  _registerMethods(api) {
    this.sendMessage = text => {
      this.chat.sendMessage(text);
    };
  }
}

module.exports = Message;