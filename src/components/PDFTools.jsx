import React, { useState } from 'react';
import { 
  FileStack, 
  Zap, 
  Trash2, 
  Download, 
  Plus, 
  FileText,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import PDFConverter from './PDFConverter';

const PDFTools = ({ compressionLevel = 'medium', user = null }) => {
  const [activeTool, setActiveTool] = useState('merge');
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [resultPdf, setResultPdf] = useState(null);
  const [showConverter, setShowConverter] = useState(false);
  
  const addHistoryRecord = async (fileName, type) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'history'), {
        userId: user.uid,
        fileName,
        type,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("History Log Error:", err);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setResultPdf(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const name = 'merged_document.pdf';
      setResultPdf({ blob, name });
      await addHistoryRecord(name, 'MERGE');
    } catch (err) {
      console.error("Merge Error:", err);
      alert("Error merging PDFs. Please ensure files are not corrupted.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      let saveOptions = { 
        useObjectStreams: true,
        addDefaultPage: false
      };

      // Tiered Compression Logic
      if (compressionLevel === 'high') {
        // Aggressive structural optimization
        saveOptions.objectsPerStream = 100;
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      } else if (compressionLevel === 'medium') {
        saveOptions.objectsPerStream = 50;
      } else {
        // Low compression: Prioritize speed and metadata
        saveOptions.useObjectStreams = false;
      }
      
      const pdfBytes = await pdfDoc.save(saveOptions);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const name = `compressed_${compressionLevel}_${files[0].name}`;
      setResultPdf({ blob, name });
      await addHistoryRecord(name, `COMPRESS (${compressionLevel.toUpperCase()})`);
    } catch (err) {
      console.error("Compression Error:", err);
      alert("Error compressing PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setResultPdf(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-pane">
        {/* Tool Toggle */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setActiveTool('merge'); setFiles([]); setResultPdf(null); }}
            className={`nav-item ${activeTool === 'merge' ? 'active' : ''}`}
            style={{ flex: 1, height: 'auto', padding: '1rem', borderRadius: '16px', background: activeTool === 'merge' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <FileStack size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>MERGE</span>
          </button>
          <button 
            onClick={() => { setActiveTool('convert'); setFiles([]); setResultPdf(null); }}
            className={`nav-item ${activeTool === 'convert' ? 'active' : ''}`}
            style={{ flex: 1, height: 'auto', padding: '1rem', borderRadius: '16px', background: activeTool === 'convert' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <RefreshCw size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>CONVERT</span>
          </button>
          <button 
            onClick={() => { setActiveTool('compress'); setFiles([]); setResultPdf(null); }}
            className={`nav-item ${activeTool === 'compress' ? 'active' : ''}`}
            style={{ flex: 1, height: 'auto', padding: '1rem', borderRadius: '16px', background: activeTool === 'compress' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <Zap size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>COMPRESS</span>
          </button>
        </div>

        {/* Dropzone */}
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
          <input {...getInputProps()} />
          <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Plus size={40} />
          </div>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            {isDragActive ? 'Drop files here' : 'Select PDF files'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {activeTool === 'merge' ? 'Add 2 or more files' : 
             activeTool === 'compress' ? `Mode: ${compressionLevel.toUpperCase()} (Adjust in Settings)` : 
             'Select a file to transform'}
          </p>
        </div>

        {/* Action Button & File List Section */}
        {files.length > 0 && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            
            {/* Primary Action Button - Now ABOVE the list for maximum visibility */}
            <div style={{ marginBottom: '1.5rem' }}>
              {!resultPdf ? (
                <button 
                  onClick={() => {
                    if (activeTool === 'convert') {
                      setShowConverter(true);
                    } else if (activeTool === 'merge') {
                      handleMerge();
                    } else {
                      handleCompress();
                    }
                  }}
                  disabled={processing || (activeTool === 'merge' && files.length < 2) || (activeTool === 'compress' && files.length === 0) || (activeTool === 'convert' && files.length === 0)}
                  className="btn-primary btn-touch"
                  style={{ position: 'relative', zIndex: 50, width: '100%' }}
                >
                  {processing ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    <>Run {activeTool === 'merge' ? 'Merge' : activeTool === 'convert' ? 'Conversion' : `${compressionLevel.charAt(0).toUpperCase() + compressionLevel.slice(1)} Compression`} <ArrowRight size={18} /></>
                  )}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeInScale 0.4s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Download size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{resultPdf.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready for download.</div>
                    </div>
                  </div>
                  <a 
                    href={resultPdf.url || URL.createObjectURL(resultPdf.blob)} 
                    download={resultPdf.name}
                    className="btn-primary btn-touch"
                    style={{ 
                      textDecoration: 'none', 
                      background: '#10b981', 
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)', 
                      pointerEvents: 'auto', 
                      position: 'relative', 
                      zIndex: 100 
                    }}
                  >
                    Save to Device <Download size={22} />
                  </a>
                  <button 
                    onClick={() => { setFiles([]); setResultPdf(null); }}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-muted)', 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '1rem',
                      borderRadius: '16px',
                      marginTop: '0.5rem'
                    }}
                  >
                    Start New Process
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable File List - Now BELOW the action button */}
            {!resultPdf && (
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                padding: '0.25rem',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                borderRadius: '12px',
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '1rem'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                  Uploaded Files ({files.length})
                </div>
                {files.map((file, idx) => (
                  <div key={idx} style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--glass-border)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <FileText size={16} color="var(--primary)" />
                      <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {showConverter && files[0] && (
        <PDFConverter 
          file={files[0]} 
          user={user}
          onComplete={async (result) => {
            setResultPdf(result);
            await addHistoryRecord(files[0].name, `CONVERT (${result.format.toUpperCase()})`);
            setShowConverter(false);
          }}
          onClose={() => setShowConverter(false)}
        />
      )}
    </div>
  );
};

export default PDFTools;
