const misc = require('../utils/misc');
const path = require('path');

module.exports = {
  enabled: true,
  name: '9GAG',
  trigger: 'command',
  pattern: /^\/9gag$/i,
  main(msg, api) {
    misc.request.get('http://api-9gag.herokuapp.com/')
    .then(res => {
      const json = JSON.parse(res.body);
      const item = json[Math.floor(Math.random()*json.length)];
      misc.fileStreamFromUrl(item.src).then(stream => {
        api.sendPhoto({
          chat_id: msg.chat.id,
          photo: stream,
          caption: item.title
        });
      }); 
    });
  }
};