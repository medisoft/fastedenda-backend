exports.list = async (ctx, next) => {
  const tasks = await ctx.pools.pg.query('SELECT i.* FROM items i, items_categories ic, categories c WHERE i.id=ic.item_id AND ic.category_id = c.id AND c.action = $1 ORDER BY i.name', [ ctx.params.category_id ]);
  ctx.body = tasks.rows;
};