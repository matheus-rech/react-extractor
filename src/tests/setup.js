import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock fetch for tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: false,
    json: async () => []
  })
)

// Mock PDF.js worker to prevent issues in test environment
vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(() => ({
    promise: Promise.reject(new Error('PDF rendering not available in tests'))
  })),
  version: '4.0.0'
}))
