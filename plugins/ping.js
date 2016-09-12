module.exports = {
  enabled: true,
  name: 'ping',
  trigger: 'command',
  pattern: /^\/ping/i,
  main(msg) {
    msg.forwardMessage({
      chat_id: msg.from.id
    })
  }
};