
const Koa = require('koa');
const Router = require('@koa/router');

const database = require('./database');

async function start(config = {}) {
  const app = new Koa();
  const router = new Router({ prefix: '/api' });

  const search = require('./search')(config);
  const library = require('./library')(config);
  const movie = require('./movie')(config);
  const tv = require('./tv')(config);
  const downloader = require('./downloader')(config);
  app.context.db = await database();

  app.use(async (ctx, next) => {
    console.log('middle ware');
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    ctx.set('X-Response-Time', `${duration}ms`);
  })

  router.get('/', ctx => { ctx.body = 'api' });
  router.use('/search', search.routes());
  router.use('/library', library.routes());
  router.use('/movie', movie.routes());
  router.use('/tv', tv.routes());
  router.use('/downloader', downloader.routes());

  app.use(router.routes()).use(router.allowedMethods());

  app.on('error', (err, ctx) => {
    console.error(err.message);
  });

  app.listen(config.PORT || 4000);
};

module.exports = start;