# PDF Provenance Viewer - Quick Start

## 🚀 Installation & Setup

```bash
cd pdf-provenance-viewer
npm install
npm run dev
```

Open http://localhost:3000

## 📁 Required Files

Place these in the `public/` directory:

1. **data.json** - Your annotation data (sample included)
2. **PDFs** - Your source PDF files

## 🎯 Quick Test

The app includes sample data - just run it to see how it works!

## 📊 Data Format

```json
{
  "id": 1,
  "filename": "study.pdf",
  "page": 3,
  "box": [102, 315, 450, 360],
  "comment": "Key finding",
  "extracted_text": "The text from the PDF...",
  "schema_field": "patient_demographics",
  "confidence": 0.95
}
```

## ⌨️ Keyboard Shortcuts

- **↑↓** - Navigate annotations
- **ESC** - Clear selection

## 📤 Export Options

- **CSV** - For Excel analysis
- **JSON** - For programmatic use

## 🔧 Customization

Edit these files to customize:
- `src/styles.css` - Colors and styling
- `src/components/` - React components
- `public/data.json` - Your data

## 📖 Full Documentation

- `README.md` - Complete feature documentation
- `WORKFLOW_GUIDE.md` - End-to-end extraction workflow
- `extract_annotations.py` - Python extraction script

## 🏥 Built For

Cerebellar stroke systematic review with:
- Patient demographics extraction
- mRS outcome tracking
- SDC procedure analysis
- Mortality rate compilation
- Full publication-ready provenance

---

**Pro Tip:** Start with the included sample data to understand the interface, then replace with your real extractions!
