const IO = require('koa-socket-2');
const io = new IO()
  , koaRedis = require('socket.io-redis');


module.exports = (app) => {
  io.attach(app);
  app._io.adapter(koaRedis(process.env.REDIS_URL));

  io.on('join', (ctx, data) => {
    console.log('join event fired', data)
  })


  io.on('message', (ctx, data) => {
    console.log('client sent data to message endpoint', data);
  });

  /**
   * Socket middlewares
   */
  io.use(async (ctx, next) => {
    console.log('Socket middleware');
    const start = new Date;
    await next();
    const ms = new Date - start;
    console.log(`WS ${ms}ms`);
  });

  io.use(async (ctx, next) => {
    ctx.teststring = 'test';
    await next();
  });

  /**
   * Socket handlers
   */
  io.on('connection', ctx => {
    console.log('Join event', ctx.id);
    io.broadcast('connections', {
      numConnections: io.connections.size
    });

    ctx.on('disconnect', () => {
      console.log('leave event', ctx.id);
      io.broadcast('connections', {
        numConnections: io.connections.size
      });
    });
  });

  io.on('data', (ctx, data) => {
    console.log('data event', data);
    console.log('ctx:', ctx.event, ctx.data, ctx.id);
    console.log('ctx.teststring:', ctx.teststring);
    ctx.socket.emit('response', {
      message: 'response from server'
    });
  });

  io.on('ack', (ctx, data) => {
    console.log('data event with acknowledgement', data);
    ctx.acknowledge('received');
  });

  io.on('numConnections', packet => {
    console.log(`Number of connections: ${io.connections.size}`);
  });

  return io;
};