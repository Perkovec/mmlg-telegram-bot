const TelegramAPI = require('./src/telegram-api');
const PluginLoader = require('./src/plugin-loader');
const Message = require('./src/message-model');
const config = require('./config');

const MMLGPlugins = new PluginLoader();

const MMLGClient = new TelegramAPI(config.token);

MMLGClient.on('message', msg => {
  MMLGPlugins.processMessage(new Message(MMLGClient, msg));
});