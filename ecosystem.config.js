module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      PORT: 80
    },
  }]
};
