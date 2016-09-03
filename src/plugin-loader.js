const path = require('path');
const fs = require('fs');
const colors = require('colors');

const pluginsPath = path.join(__dirname, '../plugins');

class PluginLoader {
  constructor() {
    this.plugins = {
      javascript: [],
      lua: [],
      python: []
    };

    this._loadPlugins();
  }

  _loadPlugins() {
    const fileList = fs.readdirSync(pluginsPath);
    let i = 0;
    while (fileList[i]) {
      const fileExt = path.extname(fileList[i]);
      if (fileExt === '.js') {
        const plugin = require(path.join(pluginsPath, fileList[i]));
        if (plugin && plugin.enabled && plugin.name) {
          this.plugins.javascript.push(plugin);
          console.log(`${plugin.name} loaded`.green);
        } else {
          console.log(`${fileList[i]} not loaded`.red);
        }
      }
      ++i;
    }
  }

  processMessage(msg) {
    if (msg && msg.text) {
      for (let i = 0; i < this.plugins.javascript.length; ++i) {
        const plugin = this.plugins.javascript[i];
        if (plugin.trigger === 'command' && plugin.pattern.test(msg.text)) {
          plugin.main.call(null, msg);
        }
      }
    }
  }
}

module.exports = PluginLoader;