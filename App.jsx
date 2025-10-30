import React, { useState, useEffect } from 'react'
import PDFViewer from './components/PDFViewer'
import AnnotationTable from './components/AnnotationTable'
import Header from './components/Header'
import StatsPanel from './components/StatsPanel'
import { FileText, AlertCircle } from 'lucide-react'

function App() {
  const [annotations, setAnnotations] = useState([])
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [stats, setStats] = useState({ total: 0, files: 0, pages: 0 })

  // Load annotations from data.json
  useEffect(() => {
    loadAnnotations()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!annotations.length) return

      const currentIndex = selectedAnnotation 
        ? annotations.findIndex(a => a.id === selectedAnnotation.id)
        : -1

      if (e.key === 'ArrowDown' && currentIndex < annotations.length - 1) {
        setSelectedAnnotation(annotations[currentIndex + 1])
        e.preventDefault()
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setSelectedAnnotation(annotations[currentIndex - 1])
        e.preventDefault()
      } else if (e.key === 'Escape') {
        setSelectedAnnotation(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [annotations, selectedAnnotation])

  async function loadAnnotations() {
    try {
      setLoading(true)
      setError(null)

      // Try to load data.json
      const response = await fetch('/data.json')
      
      if (!response.ok) {
        throw new Error(`Failed to load data.json: ${response.statusText}`)
      }

      const data = await response.json()
      setAnnotations(data)

      // Calculate stats
      const uniqueFiles = new Set(data.map(a => a.filename)).size
      const uniquePages = new Set(data.map(a => `${a.filename}-${a.page}`)).size
      setStats({
        total: data.length,
        files: uniqueFiles,
        pages: uniquePages
      })

      // Select first annotation
      if (data.length > 0) {
        setSelectedAnnotation(data[0])
      }

    } catch (err) {
      console.error('Error loading annotations:', err)
      setError(err.message)
      // Load sample data for demo
      loadSampleData()
    } finally {
      setLoading(false)
    }
  }

  function loadSampleData() {
    const sampleData = [
      {
        id: 1,
        filename: 'sample.pdf',
        page: 1,
        box: [100, 200, 400, 250],
        comment: 'Sample annotation - place your data.json in the public folder',
        extracted_text: 'This is a sample annotation. To use real data, create a data.json file with your extracted annotations.',
        schema_field: 'patient_demographics',
        extracted_value: 'N/A',
        confidence: 0.95,
        extraction_metadata: {
          timestamp: new Date().toISOString(),
          extractor: 'Sample Data Generator',
          page_dimensions: { width: 612, height: 792 }
        }
      }
    ]
    setAnnotations(sampleData)
    setSelectedAnnotation(sampleData[0])
    setStats({ total: 1, files: 1, pages: 1 })
  }

  const filteredAnnotations = annotations.filter(ann => {
    if (!filter) return true
    const searchStr = filter.toLowerCase()
    return (
      ann.extracted_text?.toLowerCase().includes(searchStr) ||
      ann.comment?.toLowerCase().includes(searchStr) ||
      ann.schema_field?.toLowerCase().includes(searchStr) ||
      ann.filename?.toLowerCase().includes(searchStr)
    )
  })

  if (loading) {
    return (
      <div className="loading-screen">
        <FileText size={48} className="loading-icon" />
        <p>Loading annotations...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        filter={filter}
        setFilter={setFilter}
        onReload={loadAnnotations}
      />
      
      <StatsPanel stats={stats} />

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={loadAnnotations}>Retry</button>
        </div>
      )}

      <div className="main-container">
        <div className="left-panel">
          <AnnotationTable
            annotations={filteredAnnotations}
            selectedAnnotation={selectedAnnotation}
            onSelectAnnotation={setSelectedAnnotation}
          />
        </div>

        <div className="right-panel">
          <PDFViewer
            annotation={selectedAnnotation}
            key={selectedAnnotation?.id}
          />
        </div>
      </div>

      <div className="keyboard-hints">
        <span>↑↓ Navigate</span>
        <span>ESC Clear selection</span>
      </div>
    </div>
  )
}

export default App
