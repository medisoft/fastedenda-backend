exports.list = async (ctx, next) => {
  const tasks = await ctx.pools.pg.query('SELECT * FROM categories WHERE task_id = $1 AND parent_id IS NULL ORDER BY orderby', [ ctx.params.task_id ]);
  if (ctx.app.io) ctx.app.io.socket.emit('categoria-' + ctx.params.task_id, tasks.rows);
  else ctx.body = tasks.rows;
  return tasks.rows;
};