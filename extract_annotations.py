#!/usr/bin/env python3
"""
Extract text from PDF regions specified in config.json with full provenance tracking.
Designed for AI-driven systematic review workflows.

Usage: python extract_annotations.py [config.json] [output.json]
"""

import json
import sys
from pathlib import Path
from datetime import datetime
import pdfplumber


def validate_box(box, page_width, page_height):
    """Validate bounding box coordinates."""
    if len(box) != 4:
        return False, "Box must have exactly 4 coordinates [x0, y0, x1, y1]"
    
    x0, y0, x1, y1 = box
    
    if x1 <= x0:
        return False, f"x1 ({x1}) must be greater than x0 ({x0})"
    if y1 <= y0:
        return False, f"y1 ({y1}) must be greater than y0 ({y0})"
    if x0 < 0 or y0 < 0 or x1 > page_width or y1 > page_height:
        return False, f"Box {box} out of page bounds ({page_width}x{page_height})"
    
    return True, None


def extract_annotations(config_path="config.json", output_path="data.json"):
    """Extract text from all annotations in config file."""
    
    # Load config
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    results = []
    stats = {"total": 0, "success": 0, "errors": 0}
    
    for file_data in config.get('files_to_process', []):
        filename = file_data['filename']
        
        # Check if PDF exists
        if not Path(filename).exists():
            print(f"⚠️  PDF not found: {filename}")
            continue
        
        try:
            with pdfplumber.open(filename) as pdf:
                for ann in file_data.get('annotations', []):
                    stats['total'] += 1
                    ann_id = ann.get('id', stats['total'])
                    page_num = ann['page']
                    
                    # Validate page number
                    if page_num < 1 or page_num > len(pdf.pages):
                        print(f"⚠️  Invalid page {page_num} for {filename} (ID: {ann_id})")
                        stats['errors'] += 1
                        continue
                    
                    # Get page (convert to 0-index)
                    page = pdf.pages[page_num - 1]
                    
                    # Validate box
                    box = ann['box']
                    valid, error_msg = validate_box(box, page.width, page.height)
                    if not valid:
                        print(f"⚠️  {filename} ID {ann_id}: {error_msg}")
                        stats['errors'] += 1
                        continue
                    
                    # Extract text
                    try:
                        cropped = page.within_bbox(box)
                        text = cropped.extract_text()
                        
                        if not text:
                            text = ""
                            print(f"⚠️  No text extracted from {filename} ID {ann_id}")
                        
                        # Build result with provenance
                        result = {
                            'id': ann_id,
                            'filename': filename,
                            'page': page_num,
                            'box': box,
                            'comment': ann.get('comment', ''),
                            'extracted_text': text,
                            'extraction_metadata': {
                                'timestamp': datetime.utcnow().isoformat() + 'Z',
                                'extractor': 'extract_annotations.py v1.0',
                                'page_dimensions': {'width': page.width, 'height': page.height}
                            }
                        }
                        
                        # Optional fields
                        for field in ['schema_field', 'extracted_value', 'confidence']:
                            if field in ann:
                                result[field] = ann[field]
                        
                        results.append(result)
                        stats['success'] += 1
                        
                    except Exception as e:
                        print(f"⚠️  Error extracting {filename} ID {ann_id}: {e}")
                        stats['errors'] += 1
        
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")
            continue
    
    # Save results
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Print summary
    print(f"\n✅ Extraction complete:")
    print(f"   Total annotations: {stats['total']}")
    print(f"   Successfully extracted: {stats['success']}")
    print(f"   Errors: {stats['errors']}")
    print(f"   Output: {output_path}")
    
    return results


if __name__ == '__main__':
    config_file = sys.argv[1] if len(sys.argv) > 1 else 'config.json'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'data.json'
    
    extract_annotations(config_file, output_file)
