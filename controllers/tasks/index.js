exports.list = async (ctx, next) => {
  const tasks = await ctx.pools.pg.query('SELECT * FROM tasks ORDER BY orderby');
  ctx.body = tasks.rows;
};

const isAuthenticated = require('../../services/isAuthenticated');

exports.listAuth = async (ctx, next) => {
  isAuthenticated(ctx, async (ctx, next) => {
    const tasks = await ctx.pools.pg.query('SELECT * FROM tasks ORDER BY orderby');
    ctx.body = tasks.rows;
  })
};