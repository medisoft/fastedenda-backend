require('dotenv').config();
const Koa = require('koa')
  , views = require('koa-views')
  , cors = require('koa-cors')
  , json = require('koa-json')
  , bodyparser = require('koa-bodyparser')
  , logger = require('koa-logger')
  , onerror = require('koa-onerror')
  , debug = require('debug')('demo:server');

const pg = require('pg')
  , pgListen = require('pg-listen/dist/index')
  , moment = require('moment')
  , redis = require('redis')
  , redisClient = redis.createClient({ url: process.env.REDIS_URL });

// Initializations
require('bluebird').promisifyAll(redisClient);

const app = new Koa();

const passport = require('./middleware/passport')(app);

// middlewares
app.use(bodyparser({
  enableTypes: [ 'json', 'form', 'text' ]
}));
app.use(json());
app.use(logger());
app.use(cors());


// error handlers
onerror(app);
redisClient.on('error', err => {
  console.error('error: ', err);
});

// statics handler
app.use(require('koa-static')(__dirname + '/public'));

// views handler
app.use(views(__dirname + '/views', { extension: 'ejs' }));

console.log(moment().format() + ': Iniciando FasteDenda');

// Database connections
const pools = {
  pg: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
  pgSub: new pgListen.default({ connectionString: process.env.DATABASE_URL }, {
    retryTimeout: 5000,
    paranoidChecking: 30000
  }),
  redis: redisClient
  // nosql: new sql.ConnectionPool(process.env.MONGO_URL)
};
global.pools = pools;
pg.types.setTypeParser(20, parseInt);
pg.types.setTypeParser(1114, t => moment.utc(t).valueOf());
pg.types.setTypeParser(1184, t => moment(t).valueOf());


app.use((ctx, next) => {
  ctx.cacheTTL = process.env.CACHE_TTL || 60;
  ctx.pools = pools;
  ctx.passport = passport;
  ctx.redis = pools.redis;
  return next();
});

// socket middlewares
require('./middleware/io')(app, { pools, passport });
require('./middleware/chat')(app, { pools, passport });

// Routes
const index = require('./routes/index');
const api = require('./routes/api');
const auth = require('./routes/auth');
const users = require('./routes/users');
app.use(index.routes(), index.allowedMethods());
app.use(api.routes(), api.allowedMethods());
app.use(auth.routes(), auth.allowedMethods());
app.use(users.routes(), users.allowedMethods());

app.listen(process.env.PORT || 3000);
