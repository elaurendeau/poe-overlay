import winston, { format } from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.simple()),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV !== "development") {
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
