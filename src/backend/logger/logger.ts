import winston, { format } from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: format.combine(format.timestamp(), format.simple()),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV !== "development") {
  logger.level = "info";
  logger.add(
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.simple()),
    })
  );

  logger.add(
    new winston.transports.File({
      filename: "combined.log",
      format: format.combine(format.timestamp(), format.simple()),
    })
  );
}

export default logger;
