import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '../utils/logger'

describe('Logger', () => {
  let consoleErrorSpy
  let consoleWarnSpy
  let consoleLogSpy
  let consoleDebugSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleLogSpy.mockRestore()
    consoleDebugSpy.mockRestore()
  })

  describe('error', () => {
    it('logs error messages', () => {
      const testError = new Error('Test error')
      logger.error('Something went wrong', testError)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('logs error without error object', () => {
      logger.error('Simple error message')

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('logs warning messages', () => {
      logger.warn('Warning message', { context: 'test' })

      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe('info', () => {
    it('logs info messages in development', () => {
      logger.info('Info message', { data: 'test' })

      // In test environment (development), should log
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('debug', () => {
    it('logs debug messages in development', () => {
      logger.debug('Debug message', { data: 'test' })

      // In test environment (development), should log
      expect(consoleDebugSpy).toHaveBeenCalled()
    })
  })
})
