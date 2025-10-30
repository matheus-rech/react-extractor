import React from 'react'
import { Search, RefreshCw, FileText } from 'lucide-react'

function Header({ filter, setFilter, onReload }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <FileText size={32} />
        <div>
          <h1>PDF Annotation Provenance Viewer</h1>
          <p>Systematic Review Data Extraction with Full Coordinate Tracking</p>
        </div>
      </div>
      
      <div className="header-right">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search annotations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {filter && (
            <button 
              className="clear-search"
              onClick={() => setFilter('')}
            >
              ×
            </button>
          )}
        </div>
        
        <button 
          className="reload-button"
          onClick={onReload}
          title="Reload data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  )
}

export default Header
