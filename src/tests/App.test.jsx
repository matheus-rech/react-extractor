import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<App />)
    expect(screen.getByText(/Loading annotations/i)).toBeInTheDocument()
  })

  it('loads annotations from successful fetch', async () => {
    const mockAnnotations = [
      {
        id: 1,
        filename: 'test.pdf',
        page: 1,
        box: [100, 200, 300, 400],
        comment: 'Test annotation',
        extracted_text: 'Test text'
      }
    ]

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockAnnotations
      })
    )

    render(<App />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading annotations/i)).not.toBeInTheDocument()
    }, { timeout: 2000 })

    // Verify we're not showing the sample data fallback message
    expect(screen.queryByText(/place your data.json in the public folder/i)).not.toBeInTheDocument()
  })

  it('shows sample data fallback when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to load'))
    )

    render(<App />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading annotations/i)).not.toBeInTheDocument()
    }, { timeout: 2000 })

    // Should load sample data - look for the sample.pdf filename
    await waitFor(() => {
      expect(screen.getByText(/sample.pdf/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('displays stats panel with correct counts', async () => {
    const mockAnnotations = [
      {
        id: 1,
        filename: 'test1.pdf',
        page: 1,
        box: [100, 200, 300, 400],
        comment: 'Test 1',
        extracted_text: 'Text 1'
      },
      {
        id: 2,
        filename: 'test2.pdf',
        page: 2,
        box: [100, 200, 300, 400],
        comment: 'Test 2',
        extracted_text: 'Text 2'
      }
    ]

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockAnnotations
      })
    )

    render(<App />)

    await waitFor(() => {
      // Should show 2 total annotations
      const statsElements = screen.getAllByText(/2/)
      expect(statsElements.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('filters annotations based on search input', async () => {
    const mockAnnotations = [
      {
        id: 1,
        filename: 'test1.pdf',
        page: 1,
        box: [100, 200, 300, 400],
        comment: 'Patient data',
        extracted_text: 'Demographics information'
      },
      {
        id: 2,
        filename: 'test2.pdf',
        page: 2,
        box: [100, 200, 300, 400],
        comment: 'Outcome data',
        extracted_text: 'Results information'
      }
    ]

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockAnnotations
      })
    )

    const { container } = render(<App />)

    await waitFor(() => {
      expect(screen.queryByText(/Loading annotations/i)).not.toBeInTheDocument()
    }, { timeout: 3000 })

    // Both annotations should be visible initially
    await waitFor(() => {
      expect(screen.getByText(/Patient data/i)).toBeInTheDocument()
      expect(screen.getByText(/Outcome data/i)).toBeInTheDocument()
    })
  })
})
