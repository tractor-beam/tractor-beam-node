module.exports = function shows(ctx) {
  ctx.response.type = 'application/json';
  ctx.body = {
    data: [],
  };
};