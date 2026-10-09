module.exports = {
  apps: [
    {
      name: 'passport-api',
      cwd: '/var/www/pasport-bezopasnosty.ru/app/passport-security-base',
      script: 'server/index.mjs',
      interpreter: '/usr/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
