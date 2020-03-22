module.exports = (app) => {
// Sessions
  const session = require('koa-session')
    , RedisStore = require('koa-redis')
    , passport = require('koa-passport')
    , LocalStrategy = require('passport-local').Strategy
    , JwtStrategy = require('passport-jwt').Strategy
    , ExtractJwt = require('passport-jwt').ExtractJwt

  app.keys = [ process.env.PASSPORT_KEY ];

  const sessionOptions = { secret: app.keys[0], store: new RedisStore(), resave: false, saveUninitialized: false };
  app.use(session(sessionOptions, app));
  app.use(passport.initialize());
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: app.keys[0]
  };
  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    console.log('Con JWT', jwtPayload);
    try {
      return redisClient.get(`jwt:${jwtPayload.id}`, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          user = JSON.parse(user);
          user.jwtId = jwtPayload.id;
          return done(null, user);
        }
        return done(null, false);
      });
    } catch (err) {
      return done(err, false);
    }
  }));
  app.use(passport.session(sessionOptions));
  const options = {};
  passport.serializeUser((user, done) => {
    return done(null, user);
  });
  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
  passport.use(new LocalStrategy(options, async (username, password, done) => {
    try {
      console.log('Passport con LocalStrategy', username, password);
      if (!global.pools || !global.pools.pg) return done(null, false);
      const userObj = await global.pools.pg.query('SELECT * FROM users WHERE username = $1 AND password = $2', [ username, password ]);
      if (userObj.rows.length) {
        return done(null, userObj.rows[0]);
      } else {
        console.log('Contraseña incorrecta');
        return done(null, false);
      }
    } catch (err) {
      console.log('Error en control de acceso: ', err);
      return done(err);
    }
  }));

  return passport;
};