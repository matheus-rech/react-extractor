import React from 'react'
import { FileText, File, BookOpen } from 'lucide-react'

function StatsPanel({ stats }) {
  return (
    <div className="stats-panel">
      <div className="stat-card">
        <FileText size={24} />
        <div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Annotations</div>
        </div>
      </div>
      
      <div className="stat-card">
        <File size={24} />
        <div>
          <div className="stat-value">{stats.files}</div>
          <div className="stat-label">PDF Files</div>
        </div>
      </div>
      
      <div className="stat-card">
        <BookOpen size={24} />
        <div>
          <div className="stat-value">{stats.pages}</div>
          <div className="stat-label">Unique Pages</div>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
