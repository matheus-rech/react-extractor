import React from 'react'
import { Download } from 'lucide-react'

function ExportButton({ annotations }) {
  
  function exportToCSV() {
    if (annotations.length === 0) {
      alert('No annotations to export')
      return
    }

    // Define CSV headers
    const headers = [
      'ID',
      'Source',
      'Page',
      'Box',
      'Extracted Text',
      'Comment',
      'Schema Field',
      'Extracted Value',
      'Confidence',
      'Timestamp',
      'Extractor'
    ]

    // Convert annotations to CSV rows
    const rows = annotations.map(ann => [
      ann.id,
      ann.filename,
      ann.page,
      `"[${ann.box?.join(', ')}]"`,
      `"${(ann.extracted_text || '').replace(/"/g, '""')}"`,
      `"${(ann.comment || '').replace(/"/g, '""')}"`,
      ann.schema_field || '',
      ann.extracted_value || '',
      ann.confidence || '',
      ann.extraction_metadata?.timestamp || '',
      ann.extraction_metadata?.extractor || ''
    ])

    // Combine headers and rows
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `annotations_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function exportToJSON() {
    if (annotations.length === 0) {
      alert('No annotations to export')
      return
    }

    const json = JSON.stringify(annotations, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `annotations_export_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="export-buttons">
      <button 
        className="export-button"
        onClick={exportToCSV}
        title="Export to CSV"
      >
        <Download size={16} />
        CSV
      </button>
      <button 
        className="export-button"
        onClick={exportToJSON}
        title="Export to JSON"
      >
        <Download size={16} />
        JSON
      </button>
    </div>
  )
}

export default ExportButton
