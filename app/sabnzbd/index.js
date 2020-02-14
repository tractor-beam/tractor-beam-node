const assert = require('assert');
const got = require('got');

class Sabnzbd {
  constructor(options) {
    assert(options, 'options is required to initialize Newznab');
    assert(options.url, 'sabnzbd server url must be provided');
    assert(options.apiKey, 'sabnzbd api key must be provided');

    this.url = options.url;
    this.apiKey = options.apiKey;
  }
  async addNZB(url) {
    const result = await got(`${this.url}/sabnzbd/api?output=json&apikey=${this.apiKey}&mode=addurl&name=${encodeURIComponent(url)}`).json();
    if (result && result.status === true) {
      console.log(result.nzo_ids);
    }
  }
}

module.exports = Sabnzbd;