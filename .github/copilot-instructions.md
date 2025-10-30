# GitHub Copilot Instructions - PDF Annotation Provenance Viewer

## Project Overview

This is a React-based web application for viewing PDF annotations with full provenance tracking. It's designed for systematic review and meta-analysis workflows, specifically for medical literature where AI agents extract data from PDFs with bounding box coordinates.

**Project Name**: PDF Provenance Viewer (internal name: react-extractor)  
**Primary Use Case**: Cerebellar stroke systematic review and medical literature data extraction  
**Architecture**: Three-part workflow (AI Agent → Python Extractor → React Viewer)

## Technology Stack

### Frontend
- **React 18** with JSX
- **Vite 5** - Build tool and dev server
- **PDF.js 3.11** - PDF rendering engine
- **Lucide React** - Icon library
- **Modern CSS** - Glassmorphism design with animations

### Backend/Data Processing
- **Python 3** with pdfplumber library (>=0.10.0)
- **JSON** - Data interchange format

### Coordinate System
- **TOP-LEFT origin** for bounding boxes: `[x0, y0, x1, y1]`
- No coordinate conversion needed between pdfplumber and HTML Canvas

## Repository Structure

```
/
├── .github/                 # GitHub configuration
├── src/                     # React application source
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   ├── styles.css          # Global styles
│   ├── components/         # React components
│   │   ├── AnnotationTable.jsx  # Interactive annotation table
│   │   ├── ExportButton.jsx     # CSV/JSON export functionality
│   │   ├── Header.jsx           # Application header
│   │   ├── PDFViewer.jsx        # PDF rendering with overlays
│   │   └── StatsPanel.jsx       # Statistics dashboard
│   └── data.json           # Sample annotation data
├── public/                 # Static assets (created at runtime)
├── dist/                   # Build output (gitignored)
├── extract_annotations.py  # Python extraction script
├── package.json           # Node.js dependencies
├── vite.config.js         # Vite configuration
├── requirements.txt       # Python dependencies
├── sample_config.json     # Sample extraction config
├── data.json              # Sample annotation data
├── index.html             # HTML entry point
├── README.md              # Comprehensive documentation
├── QUICK_START.md         # Quick setup guide
└── WORKFLOW_GUIDE.md      # End-to-end workflow documentation
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.7+
- PDFs and data.json for testing

### Installation
```bash
npm install              # Install Node.js dependencies
pip install -r requirements.txt  # Install Python dependencies
```

### Development Commands
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build
```

### Python Extraction
```bash
python extract_annotations.py config.json data.json
```

## Data Format & Schema

### Input: config.json
Configuration for the Python extraction script:
```json
{
  "files_to_process": [
    {
      "filename": "pdfs/study.pdf",
      "annotations": [
        {
          "id": 1,
          "page": 3,
          "box": [x0, y0, x1, y1],
          "comment": "Description"
        }
      ]
    }
  ]
}
```

### Output: data.json
Extracted annotation data for the React viewer:
```json
[
  {
    "id": 1,
    "filename": "Study_2023.pdf",
    "page": 4,
    "box": [102, 315, 450, 360],
    "comment": "Patient demographics",
    "extracted_text": "Full text from PDF region",
    "schema_field": "patient_demographics_total_n",
    "extracted_value": "134",
    "confidence": 0.98,
    "extraction_metadata": {
      "timestamp": "2025-10-30T14:23:45Z",
      "extractor": "claude-sonnet-4-20250514",
      "page_dimensions": {"width": 612, "height": 792}
    }
  }
]
```

### Schema Fields (Cerebellar Stroke Research)
- `patient_demographics_*` - Patient characteristics
- `inclusion_criteria` - Study inclusion/exclusion criteria
- `intervention_SDC_*` - Suboccipital decompressive craniectomy details
- `outcomes_mRS_*` - Modified Rankin Scale outcomes
- `outcomes_mortality_*` - Mortality data
- `complications_*` - Post-operative complications
- `necrosectomy_*` - Cerebellar necrosectomy procedures

## Key Features & Implementation

1. **PDF Rendering** - PDF.js with canvas-based rendering and zoom controls
2. **Bounding Box Overlays** - Clickable highlights showing extraction regions
3. **Interactive Table** - Browse annotations with search and sort
4. **Keyboard Navigation** - ↑↓ for navigation, ESC to clear selection
5. **Export** - Download as CSV or JSON
6. **Provenance Tracking** - Full metadata for reproducibility

## Code Style & Conventions

### JavaScript/React
- Use functional components with hooks
- JSX for component templates
- Modern ES6+ syntax (arrow functions, destructuring, etc.)
- CSS classes for styling (no CSS-in-JS)
- Descriptive variable names
- Component files use PascalCase

### Python
- Follow PEP 8 style guidelines
- Use docstrings for functions
- Type hints where appropriate
- Clear error messages
- Validation of bounding box coordinates

### File Organization
- Keep components in `src/components/`
- One component per file
- Export default component
- Import external dependencies first, then local files

## Common Tasks & Patterns

### Adding a New Component
1. Create file in `src/components/NewComponent.jsx`
2. Use functional component with hooks
3. Import in `App.jsx` or parent component
4. Follow existing component patterns for consistency

### Modifying Data Schema
1. Update data.json format documentation
2. Update AnnotationTable.jsx to handle new fields
3. Update extract_annotations.py if needed
4. Update ExportButton.jsx for CSV exports

### Styling Changes
1. Modify `src/styles.css` for global styles
2. Use existing CSS variables for consistency
3. Maintain glassmorphism design aesthetic
4. Ensure responsive design is preserved

### Python Extraction Updates
1. Modify `extract_annotations.py`
2. Test with sample config.json
3. Validate output format matches expected schema
4. Update documentation if behavior changes

## Testing

**Note**: This repository currently has no automated test suite.

### Manual Testing Checklist
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run dev` - dev server should start
- [ ] Load application in browser - should display UI
- [ ] Test with sample data.json - annotations should load
- [ ] Test PDF rendering - PDFs should display correctly
- [ ] Test bounding box overlays - boxes should align with PDF
- [ ] Test keyboard navigation - arrow keys should work
- [ ] Test search functionality - should filter annotations
- [ ] Test export buttons - CSV and JSON downloads should work
- [ ] Test Python script - `python extract_annotations.py` should run

### Python Testing
```bash
# Test extraction script
python extract_annotations.py sample_config.json test_output.json
# Verify test_output.json is created and formatted correctly
```

## Build & Deployment

### Production Build
```bash
npm run build
# Creates optimized bundle in dist/
# Note: dist/ is gitignored
```

### Deployment Options
- **Static hosting**: Netlify, Vercel, GitHub Pages
- **Self-hosted**: Copy dist/ to web server
- **Docker**: See WORKFLOW_GUIDE.md for Dockerfile

## Important Constraints

1. **Coordinate System**: Always use top-left origin (no conversion needed)
2. **PDF Location**: PDFs must be in `public/` directory for access
3. **Data Format**: Maintain backward compatibility with existing data.json files
4. **Browser Support**: Target Chrome/Edge 90+, Firefox 88+, Safari 14+
5. **Dependencies**: Keep minimal - avoid adding unnecessary packages

## Security Considerations

- PDFs are loaded client-side from public/ directory
- No server-side processing of sensitive data
- JSON data files should be validated before use
- PDF.js eval warning in build is from library (acceptable)

## Common Pitfalls

1. **Coordinate Misalignment**: Ensure bounding boxes use top-left origin
2. **Missing PDFs**: PDF files must exist in public/ directory
3. **Page Indexing**: Pages are 1-indexed in data.json
4. **Build Artifacts**: dist/ should not be committed to git
5. **Large Chunks Warning**: PDF.js bundle is large (expected, can be ignored)

## Documentation Updates

When making changes, update these files as needed:
- `README.md` - Comprehensive feature documentation
- `QUICK_START.md` - Quick setup instructions
- `WORKFLOW_GUIDE.md` - End-to-end workflow details
- `sample_config.json` - Example configuration

## Getting Help

- Check README.md for feature documentation
- Check WORKFLOW_GUIDE.md for extraction workflow
- Check browser console for runtime errors
- Check build output for compilation errors
- Validate JSON syntax at JSONLint.com

## Contributing Guidelines

1. **Minimal Changes**: Make the smallest possible changes to accomplish the task
2. **Test Locally**: Run build and manual tests before committing
3. **Documentation**: Update docs if behavior changes
4. **Code Style**: Match existing patterns and conventions
5. **No Breaking Changes**: Maintain backward compatibility with data format
6. **Descriptive Commits**: Use clear commit messages

## Project Goals

- Enable visual verification of AI-extracted data from PDFs
- Provide full provenance tracking for reproducible research
- Support systematic review workflows for medical literature
- Maintain a clean, professional UI for researchers
- Keep the codebase simple and maintainable

## Not in Scope

- Authentication/user management
- Server-side PDF processing
- Real-time collaboration features
- AI model training or inference
- Database integration
- Advanced PDF editing capabilities

---

**Last Updated**: 2025-10-30  
**Maintained By**: Repository contributors
