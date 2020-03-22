const IO = require('koa-socket-2');
const chat = new IO('chat')
  , koaRedis = require('socket.io-redis');

module.exports = (app) => {
  chat.attach(app)
  app._io.adapter(koaRedis(process.env.REDIS_URL));

  /**
   * Chat handlers
   */
  chat.on('connection', ctx => {
    console.log('Joining chat namespace', ctx.id);
  });

  chat.on('message', ctx => {
    console.log('chat message received', ctx.data);

    // Broadcasts to everybody, including this connection
    app.chat.broadcast('message', 'yo connections, lets chat');

    // Broadcasts to all other connections
    ctx.socket.broadcast.emit('message', 'ok connections:chat:broadcast');

    // Emits to just this socket
    ctx.socket.emit('message', 'ok connections:chat:emit');
  });

  chat.use(async (ctx, next) => {
    ctx.teststring = 'chattest';
    console.log(`ctx.socket =>`)
    console.dir(ctx.socket, { colors: true, depth: 2 })
    console.log(`ctx.socket.nsp =>`, ctx.socket.nsp)
    await next();
  });

  return chat;
};