import winston from "winston";

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

/**
 * Creates a log format function that formats log messages with a timestamp, log level,
 * and message.
 * @param {object} logObject - An object containing log level, message, and timestamp.
 * @returns A formatted log message string.
 */
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

/**
 * Creates a logger with the specified configuration.
 * @param {Object} config - The configuration object for the logger.
 * @param {string} config.level - The logging level for the logger.
 * @param {Object} config.format - The format of the logger output.
 * @param {Object[]} config.transports - An array of transports for the logger.
 * @returns A logger instance with the specified configuration.
 */
const logger = createLogger({
  level: "info",
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.File({ filename: "logs/combined.log" }),
    new transports.Console(),
  ],
});

export default logger;
