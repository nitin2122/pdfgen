import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';

// Set worker for pdfjs (using unpkg for better version reliability)
const PDF_WORKER_URL = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

export const parseFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  let text = '';

  if (extension === 'pdf') {
    text = await parsePDF(file);
  } else if (extension === 'docx') {
    text = await parseDOCX(file);
  } else if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
    text = await parseImage(file);
  } else if (extension === 'json') {
    return JSON.parse(await file.text());
  } else {
    throw new Error('Unsupported file format');
  }

  return smartExtract(text);
};

const parsePDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n';
  }

  return fullText;
};

const parseDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseImage = async (file) => {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
};

const smartExtract = (text) => {
  const lines = text.split('\n');
  const data = {
    business: { name: '', email: '', address: '' },
    client: { name: '', email: '', address: '' },
    details: { number: '', date: '', dueDate: '' },
    items: [],
    taxRate: 0,
    notes: ''
  };

  // Very basic regex-based extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  if (emails.length > 0) data.business.email = emails[0];
  if (emails.length > 1) data.client.email = emails[1];

  const invNumMatch = text.match(/Invoice\s*#?\s*:?\s*([A-Z0-9-]+)/i);
  if (invNumMatch) data.details.number = invNumMatch[1];

  const dateMatch = text.match(/Date\s*:?\s*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/i);
  if (dateMatch) data.details.date = dateMatch[1];

  // If no items found, add a placeholder
  if (data.items.length === 0) {
    data.items = [{ id: '1', description: 'Extracted Content (Review needed)', quantity: 1, price: 0 }];
    data.notes = "Extracted text summary: " + text.substring(0, 500) + "...";
  }

  return data;
};
