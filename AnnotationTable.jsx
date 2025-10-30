import React from 'react'
import { FileText, Calendar, User, Target } from 'lucide-react'
import ExportButton from './ExportButton'

function AnnotationTable({ annotations, selectedAnnotation, onSelectAnnotation }) {
  
  function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A'
    try {
      return new Date(timestamp).toLocaleString()
    } catch {
      return timestamp
    }
  }

  function truncateText(text, maxLength = 150) {
    if (!text) return 'N/A'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (annotations.length === 0) {
    return (
      <div className="empty-state">
        <FileText size={48} />
        <h3>No annotations found</h3>
        <p>Load a data.json file or adjust your filters</p>
      </div>
    )
  }

  return (
    <div className="annotation-table-container">
      <div className="table-header">
        <h2>Annotations ({annotations.length})</h2>
        <ExportButton annotations={annotations} />
      </div>

      <div className="table-wrapper">
        <table className="annotation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Extracted Text</th>
              <th>Schema Field</th>
              <th>Comment</th>
              <th>Provenance</th>
            </tr>
          </thead>
          <tbody>
            {annotations.map((ann) => (
              <tr
                key={ann.id}
                className={selectedAnnotation?.id === ann.id ? 'active' : ''}
                onClick={() => onSelectAnnotation(ann)}
              >
                <td className="id-cell">
                  <span className="id-badge">{ann.id}</span>
                </td>
                
                <td className="text-cell">
                  <div className="text-content">
                    {truncateText(ann.extracted_text)}
                  </div>
                  {ann.extracted_value && (
                    <div className="extracted-value">
                      <strong>Value:</strong> {ann.extracted_value}
                    </div>
                  )}
                  {ann.confidence && (
                    <div className="confidence">
                      Confidence: {(ann.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </td>
                
                <td className="schema-cell">
                  {ann.schema_field ? (
                    <span className="schema-badge">
                      <Target size={14} />
                      {ann.schema_field}
                    </span>
                  ) : (
                    <span className="na">N/A</span>
                  )}
                </td>
                
                <td className="comment-cell">
                  {ann.comment || <span className="na">No comment</span>}
                </td>
                
                <td className="provenance-cell">
                  <div className="provenance-item">
                    <FileText size={14} />
                    <span>{ann.filename}</span>
                  </div>
                  <div className="provenance-item">
                    <span className="page-badge">Page {ann.page}</span>
                  </div>
                  <div className="provenance-item box-coords">
                    Box: [{ann.box?.join(', ')}]
                  </div>
                  {ann.extraction_metadata?.timestamp && (
                    <div className="provenance-item">
                      <Calendar size={14} />
                      <span>{formatTimestamp(ann.extraction_metadata.timestamp)}</span>
                    </div>
                  )}
                  {ann.extraction_metadata?.extractor && (
                    <div className="provenance-item">
                      <User size={14} />
                      <span>{ann.extraction_metadata.extractor}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnnotationTable
