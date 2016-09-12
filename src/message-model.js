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
    this.sendMessage = data => {
      this.chat.sendMessage(data);
    };
  
    this.sendChatAction = action => {
      this.chat.sendChatAction(action);
    };

    this.forwardMessage = data => {
      const reqData = Object.assign(data, {
        message_id: this.message_id
      });
      this.chat.forwardMessage(reqData);
    }
    
    this.clone = () => {
      return new this.constructor(api, this);
    }
  }
}

module.exports = Message;