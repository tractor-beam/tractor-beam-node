
const Koa = require('koa');
const Router = require('@koa/router');

function start(config = {}) {
  const app = new Koa();
  const router = new Router({ prefix: '/api' });

  const search = require('./search')(config);
  const library = require('./library')(config);
  const movie = require('./movie')(config);
  const tv = require('./tv')(config);

  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    ctx.set('X-Response-Time', `${duration}ms`);
  })

  router.get('/', ctx => { ctx.body = 'api' });
  router.use('/shows', shows.routes());
  router.use('/search', search.routes());
  router.use('/library', library.routes());
  router.use('/movie', movie.routes());
  router.use('/tv', tv.routes());

  app.use(router.routes()).use(router.allowedMethods());

  app.on('error', (err, ctx) => {
    console.error(err.message);
  });

  app.listen(config.PORT || 4000);
};

module.exports = start;