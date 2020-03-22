const isAuthenticated = (ctx, next) => {
  return ctx.passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      ctx.body = { success: false, message: 'Hubo un error al autenticar tu cuenta' }; // it always redirects me to login page
      ctx.status = 500;
      console.error(err.message);
      return;
    }
    if (!user) {
      ctx.body = { success: false, message: 'Necesitas estar autenticado para consultar esta informacion' }; // it always redirects me to login page
      ctx.status = 403;
      if(info) console.log('info', info.message);
      return;
    }
    ctx.state.user = user;
    return next();
  })(ctx, next);
};

module.exports = isAuthenticated;
