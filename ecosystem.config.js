module.exports = {
  apps: [ {
    name: 'API',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: [ 'website', 'public', '.git', 'package.json', 'ecosystem.config.js' ],
    max_memory_restart: '1G',
    node_args: [ '--expose-gc', '--max-old-space-size=1024' ],
    env: {
      PORT: 80,
      LD_PRELOAD: '/usr/lib/x86_64-linux-gnu/libjemalloc.so'
    }
  } ]
};
