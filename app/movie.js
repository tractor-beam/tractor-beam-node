const Router = require('@koa/router');
const TMDB = require('./tmdb');

function init(config) {
  const router = new Router();
  const tmdb = new TMDB({ apiKey: config.get('TMDB_KEY') });

  router.get('/:id', async (ctx) => {
    const result = await tmdb.movie(ctx.params.id);
    ctx.response.type = 'application/json';
    ctx.body = { data: result };
  });

  return router;
};

module.exports = init;