import * as pdfjsLib from 'pdfjs-dist';

// Set worker path (using a CDN version for simplicity in this environment)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF file.
 * @param {File} file - The PDF file object.
 * @returns {Promise<string>} - The full text content.
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText;
}

/**
 * Extracts a specific context window around a search term.
 * Useful for deep expansion where we don't want to send the whole 500-page PDF to LLM.
 */
export function getContextSnippet(fullText, query, windowSize = 2000) {
  const index = fullText.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return fullText.slice(0, windowSize);
  
  const start = Math.max(0, index - windowSize / 2);
  const end = Math.min(fullText.length, index + windowSize / 2);
  
  return fullText.slice(start, end);
}
