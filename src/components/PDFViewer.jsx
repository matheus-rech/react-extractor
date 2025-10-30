import React, { useRef, useEffect, useState } from 'react'
import { AlertCircle, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { logger } from '../utils/logger'

// Lazy load PDF.js only when needed
let pdfjsLib = null
let pdfLoaded = false

async function loadPdfJs() {
  if (!pdfLoaded) {
    const pdfjs = await import('pdfjs-dist')
    pdfjsLib = pdfjs
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    pdfLoaded = true
  }
  return pdfjsLib
}

function PDFViewer({ annotation }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scale, setScale] = useState(1.5)
  const [pdfCache, setPdfCache] = useState({})

  useEffect(() => {
    if (annotation) {
      renderAnnotation(annotation)
    }
  }, [annotation, scale])

  async function renderAnnotation(ann) {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { filename, page, box } = ann

    setLoading(true)
    setError(null)

    try {
      // Lazy load PDF.js library
      const pdfjs = await loadPdfJs()

      // Load PDF (use cache if available)
      let pdf = pdfCache[filename]
      if (!pdf) {
        const loadingTask = pdfjs.getDocument(filename)
        pdf = await loadingTask.promise
        setPdfCache(prev => ({ ...prev, [filename]: pdf }))
      }

      // Get page
      const pdfPage = await pdf.getPage(page)
      const viewport = pdfPage.getViewport({ scale })

      // Set canvas size
      canvas.width = viewport.width
      canvas.height = viewport.height

      // Render PDF page
      await pdfPage.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise

      // Draw highlight box
      if (box && box.length === 4) {
        const [x0, y0, x1, y1] = box

        // Yellow highlight with transparency
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'
        ctx.fillRect(x0 * scale, y0 * scale, (x1 - x0) * scale, (y1 - y0) * scale)

        // Gold border
        ctx.strokeStyle = 'rgba(255, 215, 0, 1)'
        ctx.lineWidth = 3
        ctx.strokeRect(x0 * scale, y0 * scale, (x1 - x0) * scale, (y1 - y0) * scale)

        // Add label
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(x0 * scale, y0 * scale - 25, 60, 20)
        ctx.fillStyle = 'white'
        ctx.font = '12px system-ui, sans-serif'
        ctx.fillText(`ID: ${ann.id}`, x0 * scale + 5, y0 * scale - 10)
      }

    } catch (err) {
      logger.error('Error rendering PDF', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleZoomIn() {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  function handleZoomOut() {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  function handleResetZoom() {
    setScale(1.5)
  }

  if (!annotation) {
    return (
      <div className="pdf-placeholder">
        <AlertCircle size={48} />
        <p>Select an annotation to view the PDF</p>
      </div>
    )
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <div className="pdf-info">
          <strong>{annotation.filename}</strong>
          <span>Page {annotation.page}</span>
          <span>Scale: {Math.round(scale * 100)}%</span>
        </div>
        <div className="zoom-controls">
          <button onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={18} />
          </button>
          <button onClick={handleResetZoom} title="Reset Zoom">
            <RotateCw size={18} />
          </button>
          <button onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      <div className="canvas-container">
        {loading && (
          <div className="pdf-loading">
            <div className="spinner"></div>
            <p>Rendering PDF...</p>
          </div>
        )}
        
        {error && (
          <div className="pdf-error">
            <AlertCircle size={32} />
            <p>{error}</p>
            <small>Make sure the PDF file is accessible</small>
          </div>
        )}

        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>

      <div className="box-info">
        <strong>Bounding Box:</strong> [{annotation.box?.join(', ')}]
      </div>
    </div>
  )
}

export default PDFViewer
