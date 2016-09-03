const {EventEmitter} = require('events')
const popsicle = require('popsicle');

class TelegramAPI extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
    this.requestUrl = `https://api.telegram.org/bot${token}/`;
    this._polling = {
      offset: 0,
      interval: 200
    };
    this.lastPoll = null;
    this._testToken().then(isAuth => {
      if (!isAuth) return console.log('Unauthorized');
      this._startPolling();
    });
  }

  _testToken() {
    return new Promise((resolve, reject) => {
      popsicle.get(this.requestUrl + 'getMe')
      .then(function (res) {
        if (res.status !== 200) return console.log('Something went wrong');
        const body = JSON.parse(res.body);
        resolve(body.ok);
      });
    });
  }

  _getUpdates(updatePoll) {
    if (updatePoll) this.lastPoll = new Date();
    popsicle.request({
      method: 'POST',
      url: this.requestUrl + 'getUpdates',
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

        const timeDiff = new Date() - this.lastPoll;
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