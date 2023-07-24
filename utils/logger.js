const { createLogger, format, transports } = require("winston");

const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  level: "debug",
  format: combine(
    label({ label: "Oxpertise-Backend" }),
    timestamp(),
    prettyPrint()
  ),
  transports: [new transports.Console()],
});

module.exports = logger;