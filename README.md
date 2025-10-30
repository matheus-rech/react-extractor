# PDF Annotation Provenance Viewer

A professional React application for viewing PDF annotations with full coordinate tracking and provenance metadata. Designed specifically for systematic review and meta-analysis workflows where AI agents extract data from medical literature PDFs.

## Features

✅ **Full Provenance Tracking** - Every extraction includes timestamp, extractor, coordinates, and confidence  
✅ **Visual Verification** - See exact PDF regions where data was extracted  
✅ **Coordinate Highlighting** - Bounding box overlays on PDF pages  
✅ **Interactive Table** - Browse all annotations with rich metadata  
✅ **Keyboard Navigation** - Use ↑↓ to navigate annotations quickly  
✅ **Search & Filter** - Find specific extractions across all fields  
✅ **Export Functionality** - Download data as CSV or JSON  
✅ **Modern UI** - Glassmorphism design with smooth animations  
✅ **Responsive** - Works on desktop and tablet screens  

## Architecture

This application implements the PDF Annotation Provenance pattern:

1. **AI Agent** generates bounding box coordinates (`config.json`)
2. **Python Extractor** extracts text from those regions (`data.json`)
3. **Web Viewer** displays PDFs with clickable highlights (this app!)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Your extracted annotation data in `data.json` format
- PDF files accessible from the application

### Installation

```bash
cd pdf-provenance-viewer
npm install
```

### Setup Data

Place your `data.json` file in the `public/` directory:

```bash
cp /path/to/your/data.json public/data.json
```

Also copy your PDF files to the `public/` directory:

```bash
cp /path/to/pdfs/*.pdf public/
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Data Format

Your `data.json` should follow this schema:

```json
[
  {
    "id": 1,
    "filename": "Smith_2023.pdf",
    "page": 4,
    "box": [102, 315, 450, 360],
    "comment": "Patient demographics",
    "extracted_text": "A total of 134 patients...",
    "schema_field": "patient_demographics_total_n",
    "extracted_value": "134",
    "confidence": 0.98,
    "extraction_metadata": {
      "timestamp": "2025-10-30T14:23:45Z",
      "extractor": "claude-sonnet-4-20250514",
      "page_dimensions": {
        "width": 612,
        "height": 792
      }
    }
  }
]
```

### Required Fields

- `id` - Unique identifier
- `filename` - PDF filename (must be in `public/` directory)
- `page` - Page number (1-indexed)
- `box` - Bounding box `[x0, y0, x1, y1]` in top-left coordinate system

### Optional Fields

- `comment` - Human-readable note
- `extracted_text` - Full text from the region
- `schema_field` - Field name in your extraction schema
- `extracted_value` - Structured value extracted
- `confidence` - AI confidence score (0-1)
- `extraction_metadata` - Provenance information

## Coordinate System

**Critical:** Both pdfplumber and HTML Canvas use **TOP-LEFT origin**:

- `[x0, y0]` = top-left corner of the box
- `[x1, y1]` = bottom-right corner of the box
- No coordinate conversion needed!

## Features Guide

### Navigation

- **Click rows** to view annotations
- **↑/↓ keys** to navigate between annotations
- **ESC key** to clear selection

### Search

Use the search box to filter annotations by:
- Extracted text
- Comments
- Schema fields
- Filename

### Export

Click the export buttons to download:
- **CSV** - For Excel/Google Sheets analysis
- **JSON** - For programmatic processing

### Zoom

Use the zoom controls on the PDF viewer:
- **+ button** - Zoom in
- **− button** - Zoom out
- **↻ button** - Reset zoom to 150%

## Integration with Extraction Pipeline

This viewer is designed to work with the extraction workflow:

### Step 1: AI Agent generates config.json

```python
# Your AI agent identifies regions and generates config
config = {
    "files_to_process": [{
        "filename": "study.pdf",
        "annotations": [
            {"id": 1, "page": 4, "box": [102, 315, 450, 360], "comment": "Key data"}
        ]
    }]
}
```

### Step 2: Python script extracts text

```bash
python extract_annotations.py config.json data.json
```

### Step 3: View in this application

```bash
cp data.json pdf-provenance-viewer/public/
cp *.pdf pdf-provenance-viewer/public/
npm run dev
```

## Customization

### Styling

Modify `src/styles.css` to change colors, spacing, or add your organization's branding.

### Schema Fields

Add custom schema field handling in `src/components/AnnotationTable.jsx`.

### Export Format

Customize CSV columns in `src/components/ExportButton.jsx`.

## Cerebellar Stroke Research Schema

This application is optimized for the Cerebellar Stroke Extraction Schema:

- `patient_demographics_*` - Patient characteristics
- `inclusion_criteria` - Study inclusion/exclusion criteria
- `intervention_SDC_*` - Suboccipital decompressive craniectomy details
- `outcomes_mRS_*` - Modified Rankin Scale outcomes
- `outcomes_mortality_*` - Mortality data
- `complications_*` - Post-operative complications
- `necrosectomy_*` - Cerebellar necrosectomy procedures

## Troubleshooting

### PDFs not loading

1. Ensure PDF files are in `public/` directory
2. Check that filenames in `data.json` match exactly
3. Verify PDFs are not password-protected
4. Check browser console for CORS errors

### Coordinates misaligned

1. Verify you're using top-left coordinate system
2. Check that box coordinates are within page bounds
3. Ensure page numbers are correct (1-indexed)
4. Adjust zoom level for better visibility

### Data not loading

1. Confirm `data.json` is in `public/` directory
2. Validate JSON syntax (use JSONLint.com)
3. Check browser console for parsing errors
4. Verify all required fields are present

## Tech Stack

- **React 18** - UI framework
- **PDF.js** - PDF rendering
- **Vite** - Build tool
- **Lucide React** - Icons
- **Modern CSS** - Glassmorphism styling

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- PDF caching for fast navigation
- Lazy rendering of large tables
- Optimized canvas rendering
- Smooth animations with GPU acceleration

## Contributing

This application is part of your systematic review workflow. Customize it to match your specific research needs!

## License

Created for cerebellar stroke systematic review research.

## Support

For questions about:
- **Data extraction**: Check the extraction script documentation
- **Coordinate systems**: See the PDF Annotation Provenance skill
- **AI agents**: Review your LLM/vision model documentation
- **Application issues**: Check browser console and troubleshooting guide

---

**Built with** ❤️ **for systematic review researchers**
