module.exports = {
  apps: [{
    name: "mr-dj",
    script: "node_modules/.bin/next",
    args: "start -p 3000",
    env: { NODE_ENV: "production" },
    watch: false,
    time: true,
    max_restarts: 5,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    combine_logs: true
  }]
}
