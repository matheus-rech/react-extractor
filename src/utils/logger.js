/**
 * Simple logging utility for production-ready error handling
 * In production, you can replace this with services like Sentry, LogRocket, etc.
 */

const isDevelopment = import.meta.env?.MODE === 'development' || import.meta.env?.MODE === 'test'

export const logger = {
  /**
   * Log error messages
   * In production, this could send to an error tracking service
   */
  error: (message, error = null) => {
    if (isDevelopment) {
      console.error('[Error]', message, error)
    } else {
      // In production, send to error tracking service
      // Example: Sentry.captureException(error, { extra: { message } })

      // For now, still log to console in production but with structured format
      console.error(JSON.stringify({
        level: 'error',
        message,
        error: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString()
      }))
    }
  },

  /**
   * Log warning messages
   */
  warn: (message, context = null) => {
    if (isDevelopment) {
      console.warn('[Warning]', message, context)
    } else {
      console.warn(JSON.stringify({
        level: 'warn',
        message,
        context,
        timestamp: new Date().toISOString()
      }))
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (message, data = null) => {
    if (isDevelopment) {
      console.log('[Info]', message, data)
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message, data = null) => {
    if (isDevelopment) {
      console.debug('[Debug]', message, data)
    }
  }
}
