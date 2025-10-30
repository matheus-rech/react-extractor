# React Extractor - Copilot Instructions

## Repository Overview

**PDF Annotation Provenance Viewer** - A React application for viewing PDF annotations with full coordinate tracking and provenance metadata. Designed for systematic review and meta-analysis workflows where AI agents extract data from medical literature PDFs.

**Type:** Full-stack web application with Python extraction utilities  
**Size:** Small (~15 source files)  
**Primary Language:** JavaScript (React 18)  
**Secondary Language:** Python 3 (extraction script)  
**Runtime:** Node.js 18+ / Python 3.12+  
**Build Tool:** Vite 5  
**Framework:** React 18 with Vite

## Build & Validation Steps

### Prerequisites
- **Node.js:** 18+ (tested with v20.19.5)
- **npm:** 8+ (tested with 10.8.2)
- **Python:** 3.12+ (only needed for extraction script)
- **pip:** 24+ (only needed for extraction script)

### Initial Setup

**ALWAYS run npm install after cloning or when package.json changes:**
```bash
npm install
```
This takes ~15-20 seconds for a clean install. If you encounter issues, try cleaning first:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Commands

**Development Server:**
```bash
npm run dev
```
- Starts Vite dev server on http://localhost:3000
- Opens browser automatically
- Hot module replacement enabled
- Takes ~200ms to start

**Production Build:**
```bash
npm run build
```
- Builds optimized production bundle to `dist/` directory
- Takes ~3 seconds
- Bundle size warning about 595KB chunk is expected (PDF.js library)
- Output: `dist/index.html`, `dist/assets/`

**Preview Production Build:**
```bash
npm run preview
```
- Serves the production build from `dist/` folder
- Runs on http://localhost:3000 by default

### Testing

**No test suite configured.** This project has no automated tests. Do not attempt to run `npm test` or add test frameworks unless specifically requested.

### Linting

**No linter configured.** There is no ESLint, Prettier, or other linting tools. Do not run lint commands or add linting unless specifically requested.

### Python Extraction Script

**Install Python dependencies (only needed for extraction workflow):**
```bash
pip3 install -r requirements.txt
```
- Installs `pdfplumber>=0.10.0`
- Takes ~10-20 seconds

**Run extraction:**
```bash
python3 extract_annotations.py [config.json] [output.json]
```
- Default: `python3 extract_annotations.py` (uses config.json → data.json)
- Validates bounding boxes and extracts text from PDF regions
- PDFs must exist at paths specified in config.json
- Expected output: Summary with counts (total/success/errors)

### Known Issues & Workarounds

1. **npm audit warnings:** 2 moderate vulnerabilities in esbuild (via vite). These are development dependencies and do not affect production. Do not run `npm audit fix --force` unless specifically requested as it installs breaking changes.

2. **Bundle size warning:** The 595KB chunk warning during build is expected due to PDF.js library inclusion. This is acceptable for this application and does not need fixing.

3. **No public/ directory:** Unlike typical Vite projects, this project stores data.json and static files in the `src/` directory. PDFs are loaded from the root or specified paths.

4. **Python script requires PDFs:** The extraction script will gracefully report "PDF not found" warnings if PDFs don't exist, but will still generate output JSON. This is expected behavior.

## Project Architecture

### Directory Structure

```
react-extractor/
├── .github/                 # GitHub configuration
├── src/                     # React application source
│   ├── components/          # React components (5 files)
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   ├── styles.css          # Global styles (glassmorphism design)
│   └── data.json           # Sample annotation data
├── dist/                    # Build output (generated, git-ignored)
├── node_modules/           # Dependencies (git-ignored)
├── index.html              # HTML entry point for Vite
├── vite.config.js          # Vite configuration (port 3000, auto-open)
├── package.json            # Node.js dependencies & scripts
├── extract_annotations.py  # Python PDF text extraction script
├── requirements.txt        # Python dependencies (pdfplumber)
├── sample_config.json      # Example config for extraction script
├── data.json              # Root-level data file (if used)
└── [README.md, *.md]       # Documentation files
```

### Key Files

**Configuration Files:**
- `vite.config.js` - Vite build config (server port 3000, auto-open browser)
- `package.json` - npm scripts: dev, build, preview
- `.gitignore` - Excludes: node_modules/, package-lock.json, dist/, test_output.json

**Entry Points:**
- `index.html` - HTML entry, loads `/src/main.jsx`
- `src/main.jsx` - React entry point, renders `<App />` to `#root`

**Core Application:**
- `src/App.jsx` - Main component with annotation loading, keyboard navigation, filtering
- `src/components/PDFViewer.jsx` - PDF rendering with PDF.js, bounding box overlays
- `src/components/AnnotationTable.jsx` - Table of annotations with selection
- `src/components/Header.jsx` - Title and search/filter UI
- `src/components/StatsPanel.jsx` - Statistics display
- `src/components/ExportButton.jsx` - CSV/JSON export functionality
- `src/styles.css` - Glassmorphism styling, responsive layout

**Python Utilities:**
- `extract_annotations.py` - Standalone script to extract text from PDF regions using pdfplumber
  - Validates bounding boxes against page dimensions
  - Adds provenance metadata (timestamp, extractor version, page dimensions)
  - Error handling for missing PDFs, invalid pages, out-of-bounds boxes

**Data Files:**
- `src/data.json` - Sample annotation data for demo
- `sample_config.json` - Example input for extraction script
- `data.json` (root) - Alternative data location

### Component Interactions

1. **App.jsx** loads annotations from `/data.json` on mount
2. If loading fails, falls back to sample data
3. User can filter annotations via Header search
4. Clicking table rows (AnnotationTable) updates selected annotation
5. PDFViewer renders selected annotation with bounding box overlay
6. Keyboard shortcuts: ↑↓ navigate, ESC clears selection

### Data Flow

```
config.json → extract_annotations.py → data.json → App.jsx → Components
    ↑ (AI generates)    ↑ (extracts text)    ↑ (loads)    ↑ (renders)
```

### Dependencies

**Production Dependencies:**
- `react` ^18.2.0 - UI framework
- `react-dom` ^18.2.0 - React DOM rendering
- `pdfjs-dist` ^5.4.296 - PDF rendering (large bundle)
- `lucide-react` ^0.263.1 - Icon library

**Dev Dependencies:**
- `@vitejs/plugin-react` ^4.2.1 - React plugin for Vite
- `vite` ^5.0.8 - Build tool and dev server

**Python Dependencies:**
- `pdfplumber` >=0.10.0 - PDF text extraction with bounding boxes

### Coordinate System

**CRITICAL:** Both pdfplumber and HTML Canvas use **TOP-LEFT origin**:
- `[x0, y0]` = top-left corner of bounding box
- `[x1, y1]` = bottom-right corner
- No coordinate conversion needed between extraction and display
- Standard page dimensions: 612×792 (US Letter at 72 DPI)

## Validation Checklist

When making code changes, validate:

1. ✅ **npm install completes successfully** (if package.json changed)
2. ✅ **npm run build completes in ~3 seconds without errors**
3. ✅ **Build output exists in dist/ directory** (index.html + assets/)
4. ✅ **npm run dev starts server successfully** (if testing dev server)
5. ✅ **If modifying Python script:** pip3 install -r requirements.txt works
6. ✅ **If modifying Python script:** Test with sample_config.json runs without crashes

**Do NOT:**
- Add test frameworks or write tests (none exist)
- Add linting tools (none configured)
- Fix npm audit warnings unless specifically requested
- Commit dist/ directory or node_modules (git-ignored)
- Force update dependencies without testing

## Common Tasks

### Adding a New React Component

1. Create file in `src/components/ComponentName.jsx`
2. Import React: `import React from 'react'`
3. Import icons if needed: `import { IconName } from 'lucide-react'`
4. Export default component
5. Import in parent component (usually App.jsx)
6. Update styles in `src/styles.css` if needed
7. Test with `npm run dev`

### Modifying Data Schema

1. Update type definitions in comments (no TypeScript configured)
2. Modify parsing in `App.jsx` loadAnnotations()
3. Update display in relevant components
4. Update `sample_config.json` if affecting extraction
5. Update `extract_annotations.py` if affecting extraction metadata
6. Document schema changes in README.md

### Modifying Python Extraction Script

1. Test Python version: `python3 --version` (need 3.12+)
2. Make changes to `extract_annotations.py`
3. Test with sample config: `python3 extract_annotations.py sample_config.json test_output.json`
4. Verify error handling for missing PDFs
5. Check output JSON format matches expected schema

## Architecture Notes

**Design Pattern:** This is a data visualization application. The Python script is a separate utility for data preparation, not integrated into the web app.

**State Management:** Simple React useState/useEffect, no Redux/Context needed.

**Styling:** Pure CSS with CSS variables, glassmorphism effects, no CSS-in-JS.

**PDF Rendering:** PDF.js with canvas rendering, CDN-hosted worker.

**Data Source:** Static JSON file loaded via fetch, no backend API.

**Browser Support:** Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+).

## Tips for Efficient Development

1. **Trust these instructions** - This file is comprehensive. Only search the codebase if information here is incomplete or incorrect.

2. **Start with npm install** - Always run this first if node_modules is missing.

3. **Quick validation** - After changes, run `npm run build` to check for errors (~3 seconds).

4. **Check bundle size** - If adding large dependencies, monitor the build output.

5. **Data location** - The app loads `/data.json`. Ensure data files are in the correct location (root or copied during build).

6. **Coordinate system** - If working with PDFs, remember top-left origin for both extraction and display.

7. **No server-side code** - This is a purely client-side application. All data is static JSON.

8. **Documentation is extensive** - Check README.md, WORKFLOW_GUIDE.md, and QUICK_START.md for additional context.

9. **Medical research context** - This tool is designed for cerebellar stroke systematic reviews. Schema field names reflect this domain.

10. **Provenance tracking** - All extractions should include metadata (timestamp, extractor, confidence, page dimensions).
