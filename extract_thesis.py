import pdfplumber
import os

pdf_path = r'G:\Meine Ablage\BA\AutoProject\Bachelorarbeit.pdf'
output_path = r'C:\Users\user\.gemini\antigravity\scratch\thesis_summary.txt'

try:
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for i, page in enumerate(pdf.pages):
            text += f"--- Page {i+1} ---\n"
            text += page.extract_text() + "\n"
            if i > 50: # Limit for initial research
                text += "... (truncated for efficiency) ...\n"
                break

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Successfully extracted text to {output_path}")
except Exception as e:
    print(f"Error: {e}")
