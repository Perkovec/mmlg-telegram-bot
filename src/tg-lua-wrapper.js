const sendMessageFields = [
  'chat_id', 
  'text', 
  'parse_mode', 
  'disable_web_page_preview', 
  'disable_notification',
  'reply_to_message_id',
  'reply_markup',
];

const sendChatActionFields = [
  'chat_id',
  'action',
];

const forwardMessageFields = [
  'chat_id',
  'from_chat_id',
  'disable_notification',
  'message_id'
];

function table2object(table, scheme) {
  const data = {};
  for (let i = 0; i < scheme.length; ++i) {
    const field = table.get(scheme[i]);
    if (field) data[scheme[i]] = field;
  }
  return data;
}

module.exports.message = msg => {
  const copied = msg.clone();

  // MESSAGE
  copied.sendMessage = table => {
    const data = table2object(table, sendMessageFields)
    msg.sendMessage(data);
  }

  copied.sendChatAction = action => {
    msg.sendChatAction(action);
  }

  copied.forwardMessage = table => {
    const data = table2object(table, forwardMessageFields)
    msg.forwardMessage(data);
  }

  // PEER
  copied.from.sendMessage = table => {
    const data = table2object(table, sendMessageFields)
    msg.from.sendMessage(data);
  }

  copied.from.sendChatAction = action => {
    msg.from.sendChatAction(action);
  }
  
  copied.from.forwardMessage = table => {
    const data = table2object(table, forwardMessageFields)
    msg.from.forwardMessage(data);
  }

  copied.chat.sendMessage = table => {
    const data = table2object(table, sendMessageFields)
    msg.chat.sendMessage(data);
  }

  copied.chat.sendChatAction = action => {
    msg.chat.sendChatAction(action);
  }

  copied.chat.forwardMessage = table => {
    const data = table2object(table, forwardMessageFields)
    msg.chat.forwardMessage(data);
  }

  return copied;
};

module.exports.api = api => {
  return {
    sendMessage(table) {
      const data = table2object(table, sendMessageFields)
      api.sendMessage(data);
    },
    sendChatAction(table) {
      const data = table2object(table, sendChatActionFields);
      api.sendChatAction(data);
    }
  };
}