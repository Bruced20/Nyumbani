type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

/**
 * Reusable Logging Utility.
 * Outputs formatted logs in development and can route JSON logs
 * to external monitoring systems (Vercel Axiom/Logtail) in production.
 */
export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    this._log('info', message, context)
  },

  warn(message: string, context?: Record<string, unknown>) {
    this._log('warn', message, context)
  },

  error(message: string, context?: Record<string, unknown>) {
    this._log('error', message, context)
  },

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      this._log('debug', message, context)
    }
  },

  _log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const log: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    }

    if (process.env.NODE_ENV === 'development') {
      const color =
        level === 'error'
          ? '\x1b[31m'
          : level === 'warn'
            ? '\x1b[33m'
            : level === 'debug'
              ? '\x1b[36m'
              : '\x1b[32m'
      console.log(
        `${color}[${log.timestamp}] [${level.toUpperCase()}] ${message}\x1b[0m`,
        context ? JSON.stringify(context, null, 2) : ''
      )
    } else {
      // In production, log structured JSON for Vercel/Sentry/Axiom ingestion
      console.log(JSON.stringify(log))
    }
  },
}
