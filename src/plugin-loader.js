const path = require('path');
const fs = require('fs');
const colors = require('colors');
const LuaVM = require('lua.vm.js');
const TGLuaAPI = require('./tg-lua-wrapper');

const luaState = new LuaVM.Lua.State();

const pluginsPath = path.join(__dirname, '../plugins');

class PluginLoader {
  constructor(client) {
    this.plugins = {
      javascript: [],
      lua: []
    };

    this._loadPlugins();
    this._clientLua = TGLuaAPI.api(client);
    this._client = client;
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
      } else if (fileExt === '.lua') {
        const luaPlugin = fs.readFileSync(path.join(pluginsPath, fileList[i])).toString();
        const executedLua = luaState.execute(luaPlugin)[0];
        if (executedLua && executedLua.get('enabled') && executedLua.get('name')) {
          this.plugins.lua.push(executedLua);
          console.log(`${executedLua.get("name")} loaded`.green);
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
          const pluginOpts = Object.assign({}, plugin);
          pluginOpts.matches = msg.text.match(plugin.pattern);
          delete pluginOpts.main;
          plugin.main.call(pluginOpts, msg, this._client);
        }
      }

      for (let i = 0; i < this.plugins.lua.length; ++i) {
        const plugin = this.plugins.lua[i];
        const pluginPattern = plugin.get('pattern');
        const pluginPatternFlags = plugin.get('patternFlags');
        const pattern = new RegExp(pluginPattern, pluginPatternFlags);
        if (plugin.get('trigger') === 'command' && pattern.test(msg.text)) {
          const mainFunction = plugin.get('main');
          try{
            mainFunction.invoke([TGLuaAPI.message(msg), this._clientLua], 0);
          } catch(e) {
            console.log(e)
          }
        }
      }
    }
  }
}

module.exports = PluginLoader;