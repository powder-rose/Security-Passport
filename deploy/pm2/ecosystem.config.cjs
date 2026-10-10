module.exports = {
  apps: [
    {
      name: 'passport-api',
      cwd: '/var/www/pasport-bezopasnosty.ru/app/passport-security-base',
      script: '/var/www/pasport-bezopasnosty.ru/backend-current/app/server/index.mjs',
      interpreter: '/usr/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      kill_timeout: 30_000,
      watch: false,
      env: {
        PASSPORT_PROJECT_ROOT: '/var/www/pasport-bezopasnosty.ru/app/passport-security-base',
        CLIENT_DIR: '/var/www/pasport-bezopasnosty.ru/current',
      },
    },
  ],
};
