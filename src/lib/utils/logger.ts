type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  requestId?: string
  context?: Record<string, unknown>
}

// Conditionally load AsyncLocalStorage on server side to prevent browser bundle crashes
let loggerStorage: { getStore: () => { requestId?: string } | undefined } | null = null
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AsyncLocalStorage } = require('node:async_hooks')
    loggerStorage = new AsyncLocalStorage()
  } catch {
    // fallback
  }
}

export { loggerStorage }

const SENSITIVE_KEYS = new Set([
  'email',
  'password',
  'key',
  'token',
  'secret',
  'authorization',
  'service_key',
  'oauth',
  'cookie',
  'credential',
])

/**
 * Recursively redacts sensitive keys from an object to prevent leaks.
 */
function redactSensitiveData(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData)
  }

  const redactedObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase()

    // Check if key contains any sensitive keywords
    const isSensitive = Array.from(SENSITIVE_KEYS).some((sensitive) => lowerKey.includes(sensitive))

    if (isSensitive) {
      redactedObj[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      redactedObj[key] = redactSensitiveData(value)
    } else {
      redactedObj[key] = value
    }
  }

  return redactedObj
}

/**
 * Reusable Centralized Logging Utility.
 * Outputs readable colored logs in development and structured JSON in production.
 * Supports recursive redactions and request correlation IDs.
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
    // 1. Resolve correlation ID from AsyncLocalStorage store (server-only)
    const store = loggerStorage ? loggerStorage.getStore() : null
    const requestId = store?.requestId || (context?.requestId as string) || undefined

    // Remove requestId from context if it was passed there
    let cleanContext = context
    if (context && 'requestId' in context) {
      const copy = { ...context }
      delete copy.requestId
      cleanContext = copy
    }

    // 2. Redact sensitive values from the context object
    const redactedContext = cleanContext
      ? (redactSensitiveData(cleanContext) as Record<string, unknown>)
      : undefined

    const log: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(requestId ? { requestId } : {}),
      ...(redactedContext ? { context: redactedContext } : {}),
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

      const reqIdTag = requestId ? ` [\x1b[35mREQ:${requestId.slice(0, 8)}\x1b[0m]` : ''
      console.log(
        `${color}[${log.timestamp}] [${level.toUpperCase()}]\x1b[0m${reqIdTag} ${message}`,
        redactedContext ? JSON.stringify(redactedContext, null, 2) : ''
      )
    } else {
      // Structured JSON output for cloud logger aggregators (Axiom, Logtail, Datadog)
      console.log(JSON.stringify(log))
    }
  },
}
