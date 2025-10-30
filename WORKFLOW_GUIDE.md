# Complete Workflow Guide

This guide walks you through the entire PDF annotation workflow from AI extraction to visual verification.

## Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  AI Agent   │ ───> │   Python     │ ───> │   React     │
│  (Vision)   │      │  Extractor   │      │   Viewer    │
└─────────────┘      └──────────────┘      └─────────────┘
  config.json          data.json             Visual UI
```

## Step-by-Step Workflow

### Step 1: Prepare Your PDFs

Place all PDF files you want to analyze in a directory:

```bash
mkdir pdfs
cp /path/to/your/papers/*.pdf pdfs/
```

### Step 2: AI Agent Identifies Regions

Use an AI agent (vision model or LLM) to identify regions of interest in your PDFs and generate `config.json`:

**Option A: Using Claude with Vision**

```python
import anthropic
import base64

client = anthropic.Anthropic(api_key="your-api-key")

# Read PDF as image or use PDF analysis
with open("study.pdf", "rb") as f:
    pdf_data = base64.b64encode(f.read()).decode()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2000,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": pdf_data
                }
            },
            {
                "type": "text",
                "text": """Identify bounding boxes for these data fields:
                1. Patient demographics (total N)
                2. mRS outcomes at 90 days
                3. Mortality rates
                
                Return JSON with format:
                {
                  "annotations": [
                    {"id": 1, "page": 3, "box": [x0, y0, x1, y1], "comment": "description"}
                  ]
                }"""
            }
        ]
    }]
)

# Parse response and build config.json
```

**Option B: Manual Annotation**

Use a PDF viewer to identify coordinates manually, or use existing tools like Acrobat's coordinate display.

**Example config.json:**

```json
{
  "files_to_process": [
    {
      "filename": "pdfs/Smith_2023.pdf",
      "annotations": [
        {"id": 1, "page": 3, "box": [102, 315, 450, 360], "comment": "Patient N"}
      ]
    }
  ]
}
```

### Step 3: Extract Text with Python Script

Install dependencies:

```bash
pip install pdfplumber
```

Run the extraction:

```bash
python extract_annotations.py config.json data.json
```

This will:
- Validate all bounding boxes
- Extract text from each region
- Add provenance metadata
- Generate `data.json` for the viewer

**Example output:**

```
✅ Extraction complete:
   Total annotations: 6
   Successfully extracted: 6
   Errors: 0
   Output: data.json
```

### Step 4: View in React Application

Copy data and PDFs to the viewer:

```bash
# Copy data
cp data.json pdf-provenance-viewer/public/

# Copy PDFs
cp pdfs/*.pdf pdf-provenance-viewer/public/

# Start viewer
cd pdf-provenance-viewer
npm install  # First time only
npm run dev
```

Open http://localhost:3000 to view your annotations!

## Advanced Workflows

### Batch Processing Multiple Studies

```bash
#!/bin/bash
# process_all_studies.sh

for pdf in pdfs/*.pdf; do
    echo "Processing $pdf..."
    
    # 1. Generate config with AI
    python generate_config.py "$pdf" > "config_$(basename $pdf .pdf).json"
    
    # 2. Extract text
    python extract_annotations.py \
        "config_$(basename $pdf .pdf).json" \
        "data_$(basename $pdf .pdf).json"
done

# 3. Merge all data.json files
python merge_data.py data_*.json > public/data.json

# 4. Copy PDFs
cp pdfs/*.pdf public/
```

### Integration with Your Schema

Enhance the extraction script to validate against your cerebellar stroke schema:

```python
# In extract_annotations.py, add schema validation:

CEREBELLAR_SCHEMA = {
    "patient_demographics_total_n": r"\d+",
    "outcomes_mRS_90day": r"mRS 0-2: \d+\.?\d*%",
    "outcomes_mortality_overall": r"\d+\.?\d*%",
    # Add more fields...
}

def validate_extraction(text, schema_field):
    """Validate extracted text matches schema pattern."""
    if schema_field in CEREBELLAR_SCHEMA:
        pattern = CEREBELLAR_SCHEMA[schema_field]
        if not re.search(pattern, text):
            return False, f"Text doesn't match pattern for {schema_field}"
    return True, None
```

### AI-Enhanced Extraction with Structured Output

Use Claude to extract structured values:

```python
def extract_structured_value(text, schema_field):
    """Use Claude to extract structured value from text."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=200,
        messages=[{
            "role": "user",
            "content": f"""From this text: "{text}"
            
            Extract the value for field: {schema_field}
            
            Return only the structured value, nothing else."""
        }]
    )
    return response.content[0].text.strip()

# Add to extraction loop:
result['extracted_value'] = extract_structured_value(
    text, 
    ann.get('schema_field')
)
```

## Quality Control Workflow

### 1. Visual Verification

Use the viewer to verify each extraction:
- Check bounding box placement
- Verify extracted text matches PDF
- Confirm structured values are correct

### 2. Confidence Scoring

Add confidence scores based on:
- Text quality (OCR errors)
- Pattern matching success
- AI model confidence

### 3. Manual Review

Export to CSV for review:
1. Click "Export CSV" in viewer
2. Open in Excel/Google Sheets
3. Add review column
4. Flag issues for re-extraction

### 4. Iterative Refinement

```bash
# Re-extract flagged annotations
python extract_annotations.py \
    config_corrections.json \
    data_corrections.json

# Merge with existing data
python merge_data.py data.json data_corrections.json > data_updated.json
```

## Production Deployment

### Build for Production

```bash
cd pdf-provenance-viewer
npm run build
```

This creates a `dist/` directory with optimized assets.

### Deploy Options

**Option 1: Static Hosting (Netlify, Vercel)**

```bash
# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to Vercel
vercel --prod
```

**Option 2: Self-Hosted**

```bash
# Serve with nginx
cp -r dist/* /var/www/viewer/
```

**Option 3: Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

## Troubleshooting

### Common Issues

**Issue: Coordinates are off**
- Solution: Ensure you're using top-left coordinate system
- Check page dimensions match PDF

**Issue: Text extraction is garbled**
- Solution: PDF may have poor OCR quality
- Try different text extraction settings in pdfplumber

**Issue: AI can't find regions**
- Solution: Use higher resolution images
- Provide more specific instructions
- Try manual annotation for difficult papers

**Issue: Slow performance with many PDFs**
- Solution: Enable PDF caching in viewer
- Split data into multiple files
- Use pagination in table

## Best Practices

### 1. Consistent Naming

Use consistent file naming:
```
AuthorYear.pdf  (e.g., Jauss_2006.pdf)
```

### 2. Coordinate Precision

Round coordinates to integers:
```python
box = [round(x0), round(y0), round(x1), round(y1)]
```

### 3. Comprehensive Provenance

Always include:
- Timestamp
- Extractor version
- Confidence score
- Page dimensions

### 4. Version Control

Track your configs and data:
```bash
git add config.json data.json
git commit -m "Add extractions for Smith 2023"
```

### 5. Documentation

Document schema field meanings in your README.

## Next Steps

1. ✅ Set up the basic workflow
2. ✅ Test with sample PDFs
3. Integrate with your AI agent
4. Add schema validation
5. Build quality control process
6. Deploy to production
7. Train team on workflow

---

**Questions?** Check the README.md or consult the PDF Annotation Provenance skill documentation.
