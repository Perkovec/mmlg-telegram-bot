const TelegramAPI = require('./src/telegram-api');
const PluginLoader = require('./src/plugin-loader');
const Message = require('./src/message-model');
const config = require('./config');

const MMLGClient = new TelegramAPI(config.token);
const MMLGPlugins = new PluginLoader(MMLGClient);

MMLGClient.on('message', msg => {
  try {
    MMLGPlugins.processMessage(new Message(MMLGClient, msg));
  } catch(e) {
    console.log(e);
  }
});

MMLGClient.start();