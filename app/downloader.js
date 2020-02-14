const Router = require('@koa/router');
const TMDB = require('./tmdb');
const Sabnzbd = require('./sabnzbd');

function init(config) {
  const router = new Router();
  const sabnzbd = new Sabnzbd({ url: config.get('SABNZBD_URL'), apiKey: config.get('SABNZBD_KEY') });

  router.get('/', async (ctx) => {
    if (ctx.query && ctx.query.url) {
      await sabnzbd.addNZB(ctx.query.url.replace(/&amp;/g, '&'));
      ctx.response.type = 'application/json';
      ctx.response.status = 200;
      ctx.body = { status: 'OK' };
    } else {
      ctx.response.status = 400;
    }
  });

  return router;
};

module.exports = init;