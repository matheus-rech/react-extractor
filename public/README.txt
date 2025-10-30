PUBLIC DIRECTORY - Data Files
================================

This directory should contain:

1. data.json
   - Your annotation extraction data
   - Format: Array of annotation objects
   - See data.json for an example structure

2. PDF files
   - Place all your source PDF files here
   - File names must match the "filename" field in data.json
   - Example: If data.json references "study_2023.pdf", place that file here

3. Sample data provided
   - data.json contains sample annotations
   - Replace with your actual extraction data before deployment

HOW TO USE:
-----------
1. Copy your data.json file to this directory
2. Copy all referenced PDF files to this directory
3. Ensure PDF filenames match exactly with data.json
4. Run: npm run dev (for development) or npm run build (for production)

NOTE: Files in this directory are served statically and will be accessible from the root URL path.
