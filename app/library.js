const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

const data = {};

function init(config) {
  const router = new Router();

  router.use(bodyParser());
  router.get('/', async (ctx) => {
    ctx.response.type = 'application/json';
    ctx.body = {
      total: Object.values(data).length,
      data: Object.values(data),
    };
  });

  router.post('/', async (ctx) => {
    const show = ctx.request.body.show;
    if (show) {
      show.id = Object.keys(data).length;
      data[show.id] = show;
      ctx.response.status = 201;
      ctx.response.type = 'application/json';
      ctx.body = { data: show };
    } else {
      ctx.response.status = 400;
    }
  });

  router.get('/:id', async (ctx) => {
    ctx.response.type = 'application/json';
      ctx.body = { data: data[parseInt(ctx.params.id)] };
  });

  return router;
};

module.exports = init;