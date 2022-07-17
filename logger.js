const Logger = require("@ptkdev/logger");

const options = {
  language: "en",
  colors: true,
  debug: true,
  info: true,
  warning: true,
  error: true,
  sponsor: true,
  write: false,
  type: "log",
  rotate: {
    size: "10M",
    encoding: "utf8",
  },
  path: {
    debug_log: "./debug.log",
    error_log: "./errors.log",
  }
};

module.exports.log = new Logger(options);