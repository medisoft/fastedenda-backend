const router = require('koa-router')()
  , jwt = require('jsonwebtoken')
  , uuid = require('uuid/v4')

// services
const isAuthenticated = require('../services/isAuthenticated');

router.prefix('/auth');

router.post('/login', async (ctx) => {
  if (ctx.isAuthenticated()) {
    console.log('Usuario previamente autenticado');
    ctx.body = { success: true, message: 'Usuario previamente autenticado' };
    return;
  }
  return await ctx.passport.authenticate('local', { session: false }, async (err, user, info, status) => {
    console.log('Usuario autenticado con estrategia Local', user);
    if (user) {
      await ctx.login(user, { session: false });
      const jwtOptions = {
        expiresIn: 3600*24*365
      };
      const id = uuid();
      const token = jwt.sign({ id }, ctx.app.keys[0], jwtOptions);
      delete user.password;
      await ctx.redis.setex(`jwt:${id}`, jwtOptions.expiresIn, JSON.stringify(user));
      ctx.body = { success: true, message: 'Usuario autenticado', payload: user, token };
    } else {
      ctx.status = 400;
      ctx.body = { success: false, message: 'Usuario o contraseña incorrectos' };
    }
  })(ctx);
});

router.all('/logout', isAuthenticated, async (ctx) => {
  if (ctx.isAuthenticated()) {
    await ctx.redis.del(`jwt:${ctx.state.user.jwtId}`);
    await ctx.logout();
    ctx.body = { success: true, message: 'Sesion terminada' };
  } else {
    ctx.body = { success: false, message: 'No hay ninguna sesion abierta' };
  }
});

router.all('/state',  async (ctx) => {
  console.log('STATE', ctx.isAuthenticated(), ctx.isUnauthenticated())
  if (ctx.isAuthenticated()) {
    ctx.body = { success: true, authenticated: true };
  } else {
    ctx.body = { success: true, authenticated: false };
  }
});

module.exports = router;
