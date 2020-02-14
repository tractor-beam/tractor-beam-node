const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

const TMDB = require('./tmdb');

function init(config) {
  const router = new Router();
  const tmdb = new TMDB({ apiKey: config.get('TMDB_KEY') });

  router.use(bodyParser());
  router.get('/', async (ctx) => {
    const { Library } = ctx.db.models;
    const library = await Library.findAll();

    ctx.response.type = 'application/json';
    ctx.body = {
      total: library.length,
      data: library,
    };
  });

  router.post('/', async (ctx) => {
    const { Library } = ctx.db.models;
    const body = ctx.request.body;

    if (body) {
      const metadata = await tmdb.movie(body.external_id);
      const data = {
        type: body.type,
        title: metadata.title,
        summary: metadata.summary,
        poster_url: metadata.poster_url,
        backdrop_url: metadata.backdrop_url,
        imdb_id: metadata.imdb_id.substring(2),
        external_id: body.external_id,
      };
      const item = await Library.create(data);

      ctx.response.status = 201;
      ctx.response.type = 'application/json';
      ctx.body = { data: item };
    } else {
      ctx.response.status = 400;
    }
  });

  router.get('/:id', async (ctx) => {
    const { Library } = ctx.db.models;
    
    ctx.response.type = 'application/json';
    ctx.body = { data: await Library.findByPk(ctx.params.id) };
  });

  router.delete('/:id', async (ctx) => {
    const { Library } = ctx.db.models;
    await Library.destroy({
      where: {
        id: ctx.params.id,
      }
    });
    ctx.response.status = 200;
  });

  return router;
};

module.exports = init;