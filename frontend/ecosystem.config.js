module.exports = {
  apps: [
    {
      name: "mr-dj",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production" },
      watch: false,
      time: true,
      max_restarts: 5,
    },
  ],
};
