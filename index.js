const TelegramAPI = require('./src/telegram-api');
const config = require('./config');

const MMLGClient = new TelegramAPI(config.token);