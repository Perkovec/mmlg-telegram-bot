const sendMessageFields = [
  'chat_id', 
  'text', 
  'parse_mode', 
  'disable_web_page_preview', 
  'disable_notification',
  'reply_to_message_id',
  'reply_markup',
];

module.exports = msg => {
  const copied = Object.assign({}, msg);

  copied.sendMessage = function(table) {
    const data = {};
    for (let i = 0; i < sendMessageFields.length; ++i) {
      const field = table.get(sendMessageFields[i]);
      if (field) data[sendMessageFields[i]] = field;
    }
    msg.sendMessage(data);
  }

  return copied;
};