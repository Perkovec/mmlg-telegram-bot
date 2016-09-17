const {EventEmitter} = require('events')
const popsicle = require('popsicle');

const APIMethods = [
  'getMe',
  'sendMessage',
  'sendChatAction',
  'forwardMessage',
  'sendLocation',
  'sendVenue',
  'sendContact',
  'getUserProfilePhotos',
  'getFile',
  'kickChatMember',
  'leaveChat',
  'unbanChatMember',
  'getChat',
  'getChatAdministrators',
  'getChatMembersCount',
  'getChatMember',
  'answerCallbackQuery'
];

const FormApiMethods = [
  'sendPhoto',
  'sendAudio',
  'sendDocument',
  'sendSticker',
  'sendVideo',
  'sendVoice'
];

class TelegramAPI extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
    this._requestUrl = `https://api.telegram.org/bot${token}/`;
    this._polling = {
      offset: 0,
      interval: 200
    };
    this._lastPoll = null;
    this._registerEvents();
  }

  start() {
    this._startPolling();
  }

  _registerEvents() {
    for (let i = 0; i < APIMethods.length; ++i) {
      this[APIMethods[i]] = data => this._callApi(APIMethods[i], data);
    }

    for (let i = 0; i < FormApiMethods.length; ++i) {
      this[FormApiMethods[i]] = data => this._callApi(FormApiMethods[i], popsicle.form(data));
    }
  }

  _callApi(method, data) {
    return popsicle.request({
      method: 'POST',
      url: this._requestUrl + method,
      body: data
    }).then(response => response.body)
  }

  _testToken() {
    return new Promise((resolve, reject) => {
      popsicle.get(this._requestUrl + 'getMe')
      .then(res => {
        if (res.status !== 200) {
          reject();
        } else if (JSON.parse(res.body).ok) {
          resolve(body.ok);
        } else {
          reject(this);
        }
      });
    });
  }

  _getUpdates(updatePoll) {
    if (updatePoll) this._lastPoll = new Date();
    popsicle.request({
      method: 'POST',
      url: this._requestUrl + 'getUpdates',
      body: {
        offset: this._polling.offset
      }
    })
    .then(res => {
      if (res.status !== 200) return console.log('Something went wrong');
      const body = JSON.parse(res.body);
      if (body.ok) {
        if (body.result.length > 0) {
          let i = 0;
          while (i < body.result.length) {
            this.emit('message', body.result[i].message);
            ++i;
          }
        
          this._polling.offset = body.result[body.result.length - 1].update_id + 1;
          if (body.result.length === 100) return this._getUpdates();
        }

        const timeDiff = new Date() - this._lastPoll;
        if (timeDiff >= this._polling.interval) {
          this._getUpdates(true);
        } else {
          setTimeout(() => {this._getUpdates(true)}, this._polling.interval - timeDiff);
        }
      } else {
        console.log('Something went wrong');
      }
    });
  }

  _startPolling() {
    console.log('Polling');
    this._getUpdates(true);
  }
}

module.exports = TelegramAPI;