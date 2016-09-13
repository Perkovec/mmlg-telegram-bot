module.exports = {
  enabled: true,
  name: 'echo',
  trigger: 'command',
  pattern: /(^\/echo)\s(.*)/i,
  main(msg) {
    if (this.matches && this.matches[2].length) {
      msg.sendMessage({
        text: this.matches[2]
      });
    }
  }
};