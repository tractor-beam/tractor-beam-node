const Router = require('@koa/router');

const list = require('./list');

module.exports = function init() {
  const router = new Router();
  router.get('/', list);
  return router;
}();