import React, { useState } from 'react';
import { 
  FileText, 
  Presentation, 
  Type, 
  Download, 
  X, 
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';

// Sync worker
const PDFJS_VERSION = '5.7.284';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

const PDFConverter = ({ file, onClose, onComplete }) => {
  const [format, setFormat] = useState('docx');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractTextData = async () => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    
    let pagesData = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      pagesData.push({ pageNum: i, text, items: textContent.items });
      setProgress(Math.round((i / pdf.numPages) * 100));
    }
    return pagesData;
  };

  const convertToDocx = async (pagesData) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: pagesData.map(page => (
          new Paragraph({
            children: [
              new TextRun({
                text: page.text,
                size: 24,
              }),
            ],
          })
        )),
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, file.name.replace('.pdf', '.docx'));
  };

  const convertToPptx = async (pagesData) => {
    const pres = new pptxgen();
    pagesData.forEach(page => {
      let slide = pres.addSlide();
      slide.addText(page.text, { 
        x: 0.5, y: 0.5, w: '90%', h: '90%', 
        fontSize: 12, 
        color: '363636',
        align: pres.AlignH.left,
        valign: pres.AlignV.top
      });
    });
    await pres.writeFile({ fileName: file.name.replace('.pdf', '.pptx') });
  };

  const convertToTxt = async (pagesData) => {
    const fullText = pagesData
      .map(p => `--- Page ${p.pageNum} ---\n\n${p.text}`)
      .join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain' });
    saveAs(blob, file.name.replace('.pdf', '.txt'));
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const pagesData = await extractTextData();
      let blob;
      let extension;

      if (format === 'docx') {
        const doc = new Document({
          sections: [{
            properties: {},
            children: pagesData.map(page => (
              new Paragraph({
                children: [
                  new TextRun({
                    text: page.text,
                    size: 24,
                  }),
                ],
              })
            )),
          }],
        });
        blob = await Packer.toBlob(doc);
        extension = 'docx';
      } else if (format === 'pptx') {
        const pres = new pptxgen();
        pagesData.forEach(page => {
          let slide = pres.addSlide();
          slide.addText(page.text, { 
            x: 0.5, y: 0.5, w: '90%', h: '90%', 
            fontSize: 12, 
            color: '363636',
            align: pres.AlignH.left,
            valign: pres.AlignV.top
          });
        });
        // For pptx, we need to generate a blob
        // pptxgenjs write to blob is a bit different, but Packer.toBlob works for docx
        // For pptxgenjs, we can use write({ outputType: 'blob' })
        const output = await pres.write({ outputType: 'blob' });
        blob = output;
        extension = 'pptx';
      } else {
        const fullText = pagesData
          .map(p => `--- Page ${p.pageNum} ---\n\n${p.text}`)
          .join('\n\n');
        blob = new Blob([fullText], { type: 'text/plain' });
        extension = 'txt';
      }
      
      const resultName = file.name.replace('.pdf', '.' + extension);
      saveAs(blob, resultName);
      onComplete({ blob, name: resultName, format });
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Conversion failed. Please try a simpler PDF.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(2, 6, 23, 0.95)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="glass-pane" style={{ maxWidth: '500px', width: '100%', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Convert PDF</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Select target format for: <span style={{ color: 'var(--primary)' }}>{file.name}</span></p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { id: 'docx', label: 'Word', icon: FileText, color: '#2b5797' },
            { id: 'pptx', label: 'PowerPoint', icon: Presentation, color: '#d24726' },
            { id: 'txt', label: 'Plain Text', icon: Type, color: '#666' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFormat(opt.id)}
              style={{
                background: format === opt.id ? 'rgba(0, 112, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${format === opt.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                padding: '1.5rem 1rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ color: format === opt.id ? 'var(--primary)' : 'white', opacity: format === opt.id ? 1 : 0.6 }}>
                <opt.icon size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {converting ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div className="fluid-bar" style={{ height: '4px', width: '100%', marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
              <Loader2 className="animate-spin" size={20} />
              <span style={{ fontWeight: 600 }}>Reconstructing Document... {progress}%</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleConvert}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem' }}
          >
            Start Conversion <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PDFConverter;
