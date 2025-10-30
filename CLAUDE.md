# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **PDF Annotation Provenance Viewer** - a React application designed for systematic review workflows where AI agents extract data from medical literature PDFs with full coordinate tracking and provenance metadata. The application displays PDFs with bounding box highlights that show exactly where data was extracted from.

## Three-Part Architecture

This application implements the PDF Annotation Provenance pattern:

1. **AI Agent** (external) → Generates bounding box coordinates in `config.json`
2. **Python Extractor** (`extract_annotations.py`) → Extracts text from PDF regions, outputs `data.json`
3. **React Viewer** (this app) → Visualizes PDFs with interactive highlights

## Common Commands

### JavaScript/React Development

```bash
# Install dependencies
npm install

# Run development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Python Extraction

```bash
# Install Python dependencies
pip install -r requirements.txt

# Extract annotations from PDFs
python extract_annotations.py [config.json] [output.json]

# Default: python extract_annotations.py config.json data.json
```

## File Structure & Components

The project has an **unconventional structure** with React components at the root level (not in `src/`):

- **App.jsx** - Main application component, orchestrates data loading and state management
- **PDFViewer.jsx** - PDF.js integration, renders PDF pages with bounding box overlays
- **AnnotationTable.jsx** - Interactive table of all annotations with provenance metadata
- **Header.jsx** - Search bar and reload functionality
- **StatsPanel.jsx** - Statistics display
- **ExportButton.jsx** - CSV/JSON export functionality
- **main.jsx** - React entry point
- **styles.css** - Glassmorphism styling
- **extract_annotations.py** - Python script for text extraction from PDF bounding boxes

**Data Files** (placed in `public/` directory at runtime):
- `data.json` - Extracted annotations with provenance
- PDF files referenced in annotations

## Critical: Coordinate System

**Both pdfplumber (Python) and HTML Canvas (React) use TOP-LEFT origin:**

- Bounding boxes are `[x0, y0, x1, y1]` where:
  - `(x0, y0)` = top-left corner
  - `(x1, y1)` = bottom-right corner
- **No coordinate conversion needed** between Python extraction and React rendering
- Coordinates are scaled by the zoom factor in PDFViewer (default: 1.5x)

## Data Format

`data.json` schema (array of annotation objects):

```json
{
  "id": 1,                              // Required: unique identifier
  "filename": "Smith_2023.pdf",         // Required: must be in public/
  "page": 4,                            // Required: 1-indexed page number
  "box": [102, 315, 450, 360],          // Required: [x0, y0, x1, y1]
  "comment": "Patient demographics",    // Optional: human-readable note
  "extracted_text": "134 patients...", // Optional: full extracted text
  "schema_field": "patient_demographics_total_n", // Optional: structured field name
  "extracted_value": "134",             // Optional: parsed value
  "confidence": 0.98,                   // Optional: AI confidence (0-1)
  "extraction_metadata": {              // Optional: provenance tracking
    "timestamp": "2025-10-30T14:23:45Z",
    "extractor": "claude-sonnet-4-20250514",
    "page_dimensions": {"width": 612, "height": 792}
  }
}
```

## Application Architecture

### State Management (App.jsx)

- **annotations** - Full list loaded from `data.json`
- **selectedAnnotation** - Currently selected annotation (drives PDFViewer)
- **filter** - Search filter string (client-side filtering)
- **stats** - Computed statistics (total annotations, unique files, unique pages)

### Data Flow

1. `App.jsx` fetches `/data.json` on mount
2. Falls back to sample data if `data.json` not found
3. User selects annotation in `AnnotationTable`
4. Selection propagates to `PDFViewer` via `selectedAnnotation` prop
5. `PDFViewer` renders PDF page and draws bounding box overlay

### Keyboard Navigation (App.jsx:22-43)

- **↑/↓** - Navigate between annotations
- **ESC** - Clear selection
- Navigation implemented via global keydown listener

### PDF Rendering (PDFViewer.jsx)

1. PDF.js loads PDF document (cached by filename)
2. Renders specific page to canvas at current scale
3. Draws yellow highlight with gold border at bounding box coordinates
4. Adds ID label above bounding box
5. Coordinates are multiplied by scale factor for proper positioning

### Search & Filtering (App.jsx:108-117)

Client-side filtering searches across:
- `extracted_text`
- `comment`
- `schema_field`
- `filename`

### Export Functionality

Users can export annotations as CSV or JSON for external analysis.

## Python Extraction Script

`extract_annotations.py` features:

- **Input**: `config.json` with file paths and bounding box annotations
- **Output**: `data.json` with extracted text and full provenance
- **Validation**: Checks page numbers, bounding box coordinates, file existence
- **Error Handling**: Continues processing other annotations if one fails
- **Provenance**: Automatically adds timestamp, extractor version, page dimensions

The script uses `pdfplumber` for text extraction via the `within_bbox()` method.

## Integration Notes

### Adding PDFs and Data

To use the application with real data:

```bash
# Copy data file to public directory
cp /path/to/data.json public/

# Copy PDF files to public directory
cp /path/to/pdfs/*.pdf public/

# Start dev server
npm run dev
```

### Schema Fields

The application is optimized for cerebellar stroke research with these field categories:
- `patient_demographics_*` - Patient characteristics
- `inclusion_criteria` - Study criteria
- `intervention_SDC_*` - Suboccipital decompressive craniectomy details
- `outcomes_mRS_*` - Modified Rankin Scale outcomes
- `outcomes_mortality_*` - Mortality data
- `complications_*` - Post-operative complications
- `necrosectomy_*` - Cerebellar necrosectomy procedures

These are display conventions in the UI; the schema itself is flexible.

## Build Configuration

- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **PDF.js** - PDF rendering (loaded from CDN worker)
- **Lucide React** - Icon library
- Server port: 3000 (configured in `vite.config.js`)
- Auto-opens browser on `npm run dev`

## Troubleshooting

### PDFs not loading
- Ensure PDFs are in `public/` directory
- Filenames in `data.json` must match exactly (case-sensitive)
- Check browser console for CORS errors

### Coordinates misaligned
- Verify top-left coordinate system is used
- Check that scale factor is accounted for
- Ensure page numbers are 1-indexed in data

### Data not loading
- Confirm `data.json` is valid JSON
- Check it's in `public/` directory
- Verify all required fields (id, filename, page, box) are present
