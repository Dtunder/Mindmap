import pypdf
import os

files = [
    r"G:\Meine Ablage\(VO) Oberflächentechnik Teil 1_20260420_1543\Übungsunterlagen\Übung 1 - Technische Oberflächen.pdf",
    r"G:\Meine Ablage\(VO) Oberflächentechnik Teil 1_20260420_1543\Übungsunterlagen\Übung 2- Tribologie.pdf",
    r"G:\Meine Ablage\(VO) Oberflächentechnik Teil 1_20260420_1543\Übungsunterlagen\Übung 3 - Elektrochemische Korrosion.pdf"
]

output_dir = r"C:\Users\user\.gemini\antigravity\scratch\ot_text"

for file in files:
    if not os.path.exists(file):
        print(f"File not found: {file}")
        continue

    filename = os.path.basename(file).replace(".pdf", ".txt")
    print(f"Processing {file}...")
    try:
        reader = pypdf.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved to {filename}")
    except Exception as e:
        print(f"Error processing {file}: {e}")
