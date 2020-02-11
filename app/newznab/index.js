const assert = require('assert');
const got = require('got');
const parser = require('fast-xml-parser');

class Newznab {
  constructor(options) {
    assert(options, 'options is required to initialize Newznab');
    assert(options.url, 'newznab server url must be provided');
    assert(options.apiKey, 'newznab api key must be provided');

    this.url = options.url;
    this.apiKey = options.apiKey;
  }
  async capabilities() {
    const xmlResult = await got(`${this.url}/api?t=caps`).body;
    console.log(xmlResult);
  }
  async searchByName(name) {
    const xmlResult = await got(`${this.url}/api?apikey=${this.apiKey}&t=search&q=${name}`);
    const jsonResult = parser.parse(xmlResult.body);
    return {
      total: jsonResult.rss.channel.item.length,
      data: jsonResult.rss.channel.item,
    };
  }
  async searchMovieByIMDB(id) {
    const xmlResult = await got(`${this.url}/api?apikey=${this.apiKey}&t=movie&imdbid=${id}`);
    const jsonResult = parser.parse(xmlResult.body);
    return {
      total: jsonResult.rss.channel.item.length,
      data: jsonResult.rss.channel.item,
    };
  }
}

module.exports = Newznab;