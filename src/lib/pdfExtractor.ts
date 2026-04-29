import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text content from a PDF file
 * @param file - PDF File object
 * @returns Promise<string> - Extracted text content
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const totalPages = pdf.numPages;
    
    // Extract text from each page
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract text items and join them
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n--- Page ${i} ---\n${pageText}\n`;
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
  }
};

/**
 * Get basic PDF information
 * @param file - PDF File object
 * @returns Promise<{pages: number, size: string}>
 */
export const getPDFInfo = async (file: File): Promise<{pages: number, size: string}> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const pages = pdf.numPages;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    
    return {
      pages,
      size: `${sizeInMB} MB`
    };
  } catch (error) {
    console.error('Error getting PDF info:', error);
    throw new Error('Failed to read PDF file.');
  }
};
