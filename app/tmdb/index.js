const got = require('got');
const config = require('config');

const API_URL = 'https://api.themoviedb.org/3';
const POSTER_URL = 'https://image.tmdb.org/t/p/w154';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

class TMDB {
  constructor(options = {}) {
    this.options = options;
  }

  async search(type, name, page) {
    let path = `${API_URL}/search/${type}?api_key=${this.options.apiKey}&query=${name}`;
    if (page) {
      path += `&page=${page}`;
    }
    const results = await got(path).json();
    return _convertToCommonMetadata(results);
  }

  async discover() {
    let path = `${API_URL}/discover?api_key=${this.options.apiKey}&query=${name}`;
  }

  async movie(id) {
    let path = `${API_URL}/movie/${id}?api_key=${this.options.apiKey}`;
    const results = await got(path).json();
    return results;
  }

  async tv(id) {
    let path = `${API_URL}/tv/${id}?api_key=${this.options.apiKey}`;
    const results = await got(path).json();
    return results;
  }
}

function _convertToCommonMetadata(results) {
  const output = {
    page: 1,
    pages: 1,
    total: 0,
    data: [],
  };
  if (results) {
    output.page = results.page;
    output.pages = results.total_pages;
    output.total = results.total_results;
    output.data = results.results.map((result) => {
      return {
        id: result.id,
        title: result.title,
        original_title: result.original_title,
        summary: result.overview,
        poster_url: `${POSTER_URL}${result.poster_path}`,
        backdrop_url: `${BACKDROP_URL}${result.backdrop_path}`,
      };
    });
  }
  return output;
}

module.exports = TMDB;