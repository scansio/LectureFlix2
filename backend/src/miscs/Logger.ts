import winston from 'winston'

// Define logger configuration
const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [
    //new winston.transports.Console(),
    new winston.transports.File({ filename: 'file_store/logs/error.log', level: 'error' }),
    //new winston.transports.File({ filename: 'file_store/logs/combined.log' })
  ],
}

// Create a new logger instance
const Logger = winston.createLogger(loggerConfig)

// Export the logger instance
export default Logger
