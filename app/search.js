const Router = require('@koa/router');
const TMDB = require('./tmdb');
const Newznab = require('./newznab');

function init(config) {
  const router = new Router();
  const tmdb = new TMDB({ apiKey: config.get('TMDB_KEY') });

  router.get('/', async (ctx) => {
    const query = _filterQuery(ctx.query);
    const results = await tmdb.search(query.type, query.name, query.page);
    ctx.response.type = 'application/json';
    ctx.body = results;
  });
  router.get('/movie', async (ctx) => {
    try {
      const query = _filterQuery(ctx.query);
      const results = await tmdb.search('movie', query.name, query.page);
      ctx.response.type = 'application/json';
      ctx.body = results;
    } catch (error) {
       ctx.response.status = error.statusCode || 500;
       ctx.body = {
         message: error.message,
       };
     }
  });
  router.get('/tv', async (ctx) => {
    const query = _filterQuery(ctx.query);
    const results = await tmdb.search('tv', query.name, query.page);
    ctx.response.type = 'application/json';
    ctx.body = results;
  });
  router.get('/nzb', async (ctx) => {
    const nzbgeek = new Newznab({ url: config.get('NEWZNAB_URL'), apiKey: config.get('NEWZNAB_KEY') });
    if (ctx.query.name) {
      const results = await nzbgeek.searchByName(ctx.query.name);
      ctx.body = results;
    } else if (ctx.query.imdb_id) {
      const results = await nzbgeek.searchMovieByIMDB(ctx.query.imdb_id);
      ctx.body = results;
    } else {
      ctx.response.status = 422;
       ctx.body = {
         message: 'nothing provided to search',
       };
    }
  });

  return router;
};

function _filterQuery(query) {
  if (!query.name) {
    const error = new Error('nothing provided to search');
    error.statusCode = 422;
    throw error;
  }
  return {
    type: _filterType(query.type),
    name: _filterName(query.name),
    page: _filterPage(query.page),
  };
}

function _filterType(type) {
  if (type === 'movie' || type === 'tv') {
    return type;
  }
  return 'movie';
}

function _filterName(name) {
  return name || '';
}

function _filterPage(page) {
  return isNaN(page) ? 1 : parseInt(page);
}

module.exports = init;