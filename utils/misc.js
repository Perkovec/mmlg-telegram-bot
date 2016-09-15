const fs = require('fs');
const http = require('http');
const url = require('url');
const popsicle = require('popsicle');

class Misc {
  static fileStreamFromDir(path) {
    return fs.createReadStream(path);
  }

  static fileStreamFromUrl(uri) {
    return new Promise(resolve => {
      const parsedUrl = url.parse(uri);
      const options = {
        host: parsedUrl.host,
        path: parsedUrl.path
      };

      http.get(options).on('response', resolve);
    });
  }
}

module.exports = Misc;
module.exports.request = popsicle;