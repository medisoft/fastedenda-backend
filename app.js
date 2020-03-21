const Koa = require('koa');
const cors = require('koa-cors');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const pg = require('pg')
  , pgListen = require('pg-listen/dist/index')
  , moment = require('moment');

const index = require('./routes/index');
const api = require('./routes/api');
const users = require('./routes/users');
const router = require('koa-router')();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: [ 'json', 'form', 'text' ]
}));
app.use(json());
app.use(logger());
app.use(cors());

const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
require('bluebird').promisifyAll(redisClient);
// Sessions
const session = require('koa-session');
const RedisStore = require('koa-redis');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
app.keys = [ 'ubDajnok7ocEvDihippyesiasjergIcbegUphHokkofIdHacpydEkVeykicgoghs' ];

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
passport.use(new LocalStrategy(options, (username, password, done) => {
  console.log('Passport con LocalStrategy', username, password);
  if (!global.pools || !global.pools.GESTOR) return done(null, false);
  if (true) {
    return done(null, userObj);
  } else {
    console.log('Contraseña incorrecta');
    return done(null, false);
  }
// .catch((err) => {
//     console.log('Error en control de acceso: ', err);
//   return done(err);
// });
}));

//
app.use(require('koa-static')(__dirname + '/public'));
//
app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next();
  const ms = new Date() - start;
  // Log de HTTP
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

console.log(moment().format() + ': Iniciando FasteDenda');
const pools = {
  pg: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
  pgSub: new pgListen.default({ connectionString: process.env.DATABASE_URL }, {
    retryTimeout: 5000,
    paranoidChecking: 30000
  }),
  redis: redisClient
  // nosql: new sql.ConnectionPool(process.env.MONGO_URL)
};
pg.types.setTypeParser(20, parseInt);
pg.types.setTypeParser(1114, t => moment.utc(t).valueOf());
pg.types.setTypeParser(1184, t => moment(t).valueOf());
app.use((ctx, next) => {
  ctx.cacheTTL = process.env.CACHE_TTL || 60;
  ctx.pools = pools;
  ctx.passport = passport;
  global.pools = ctx.pools;
  ctx.redis = pools.redis;
  return next();
});
// routes
// app.use(Authentication.routes(), Authentication.allowedMethods());
app.use(index.routes(), index.allowedMethods());
app.use(api.routes(), api.allowedMethods());
// app.use(users.routes(), users.allowedMethods());

console.log(moment().format() + ': Iniciando conexion');
module.exports = app;

redisClient.on('error', err => {
  console.error('error: ', err);
});



