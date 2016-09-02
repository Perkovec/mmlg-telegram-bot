const {EventEmitter} = require('events')
const popsicle = require('popsicle');

class TelegramAPI extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
    this.requestUrl = `https://api.telegram.org/bot${token}/`;
    this._testToken().then(isAuth => {
      if (!isAuth) return console.log('Unauthorized');
      console.log('Polling');
      this._startListen();
      this._polling = {
        offset: 0,
        interval: 200
      };
    });
  }

  _testToken() {
    return new Promise((resolve, reject) => {
      popsicle.get(this.requestUrl + 'getMe')
      .then(function (res) {
        const body = JSON.parse(res.body);
        resolve(body.ok);
      });
    });
  }

  _startListen() {
    setInterval(this._getUpdates, this._polling.interval);
  }
}

module.exports = TelegramAPI;