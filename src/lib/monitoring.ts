import { logger } from './utils/logger'

export interface MonitoringProvider {
  initialize(): void
  captureException(error: Error, context?: Record<string, unknown>): void
  trackEvent(name: string, properties?: Record<string, unknown>): void
}

/**
 * No-Operation Monitoring Provider.
 * Safely ignores logs or outputs debug markers inside development environments.
 */
class NoOpProvider implements MonitoringProvider {
  initialize(): void {
    logger.debug('Monitoring: Initialized NoOpProvider (Telemetry disabled).')
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    logger.debug('Monitoring (NoOp): Captured exception', {
      error: error.message,
      stack: error.stack,
      ...context,
    })
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    logger.debug(`Monitoring (NoOp): Tracked event "${name}"`, properties)
  }
}

/**
 * Sentry Monitoring Provider.
 * Skeleton preparation for official Sentry implementation.
 */
class SentryProvider implements MonitoringProvider {
  initialize(): void {
    logger.info('Monitoring: Initializing Sentry SDK...')
    // placeholder: Sentry.init({ dsn: process.env.SENTRY_DSN })
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    logger.error(`Sentry: Captured exception: ${error.message}`, context)
    // placeholder: Sentry.captureException(error, { extra: context })
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    logger.info(`Sentry: Tracked custom event "${name}"`, properties)
  }
}

/**
 * OpenTelemetry Monitoring Provider.
 * Skeleton preparation for OpenTelemetry integration.
 */
class OpenTelemetryProvider implements MonitoringProvider {
  initialize(): void {
    logger.info('Monitoring: Initializing OpenTelemetry Spans & Tracing...')
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    logger.error(`OpenTelemetry: Recorded span exception: ${error.message}`, context)
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    logger.debug(`OpenTelemetry: Event span trace: "${name}"`, properties)
  }
}

// Factory resolver that loads the active provider based on feature flags
function resolveProvider(): MonitoringProvider {
  const useSentry = process.env.ENABLE_SENTRY === 'true'
  const useOTel = process.env.ENABLE_OPENTELEMETRY === 'true'

  if (useSentry) return new SentryProvider()
  if (useOTel) return new OpenTelemetryProvider()

  return new NoOpProvider()
}

export const monitoring = resolveProvider()
