import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { 
  X, 
  Type, 
  Pencil, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Palette
} from 'lucide-react';

// Synchronize worker version with package.json (5.7.284)
const PDFJS_VERSION = '5.7.284';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

const PDFEditor = ({ file, onSave, onClose }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [tool, setTool] = useState('text'); // 'text', 'draw'
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0070FF');
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages || 0);
      } catch (err) {
        console.error("PDF Load Error:", err);
        alert("Failed to load PDF. The file may be encrypted or corrupted.");
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [file]);

  useEffect(() => {
    if (pdfDoc) renderPage();
  }, [pdfDoc, currentPage, scale]);

  const renderPage = async () => {
    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      await page.render(renderContext).promise;
      
      // Set draw canvas size to match
      const drawCanvas = drawCanvasRef.current;
      drawCanvas.height = viewport.height;
      drawCanvas.width = viewport.width;
      redrawAnnotations();
    } catch (err) {
      console.error("Render Error:", err);
    }
  };

  const redrawAnnotations = () => {
    const ctx = drawCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    
    annotations.forEach(anno => {
      if (anno.page === currentPage) {
        if (anno.type === 'draw') {
          ctx.beginPath();
          ctx.strokeStyle = anno.color;
          ctx.lineWidth = 2;
          anno.points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();
        } else if (anno.type === 'text') {
          ctx.font = `${anno.fontSize}px sans-serif`;
          ctx.fillStyle = anno.color;
          ctx.fillText(anno.text, anno.x, anno.y);
        }
      }
    });
  };

  const handleMouseDown = (e) => {
    if (tool === 'draw') {
      setIsDrawing(true);
      const rect = drawCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setAnnotations([...annotations, { type: 'draw', page: currentPage, color, points: [{ x, y }] }]);
    } else if (tool === 'text') {
      const rect = drawCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const text = prompt("Enter text:");
      if (text) {
        setAnnotations([...annotations, { type: 'text', page: currentPage, color, text, x, y, fontSize: 16 * scale }]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool !== 'draw') return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const lastAnno = annotations[annotations.length - 1];
    lastAnno.points.push({ x, y });
    setAnnotations([...annotations.slice(0, -1), lastAnno]);
    redrawAnnotations();
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfLibDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfLibDoc.getPages();
      
      for (const anno of annotations) {
        const page = pages[anno.page - 1];
        const { width, height } = page.getSize();
        
        // Map browser coordinates to PDF coordinates
        // PDF (0,0) is bottom-left
        if (anno.type === 'text') {
          const x = (anno.x / drawCanvasRef.current.width) * width;
          const y = height - (anno.y / drawCanvasRef.current.height) * height;
          page.drawText(anno.text, { x, y, size: anno.fontSize / scale, color: rgb(0, 0.44, 1) });
        }
      }
      
      const pdfBytes = await pdfLibDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      onSave({ blob, name: 'edited_' + file.name });
    } catch (err) {
      console.error(err);
      alert("Error saving PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      zIndex: 1000, 
      background: 'rgba(2, 6, 23, 0.98)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Editor Toolbar */}
      <header className="glass-pane" style={{ 
        margin: '1rem', 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onClose} className="nav-item"><X size={20} /></button>
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />
          <h2 style={{ fontSize: '1rem', color: 'white' }}>{file.name}</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setTool('text')}
            className={`nav-item ${tool === 'text' ? 'active' : ''}`}
            style={{ width: '40px', height: '40px' }}
          >
            <Type size={18} />
          </button>
          <button 
            onClick={() => setTool('draw')}
            className={`nav-item ${tool === 'draw' ? 'active' : ''}`}
            style={{ width: '40px', height: '40px' }}
          >
            <Pencil size={18} />
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 1rem', borderRadius: '10px' }}>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="nav-item" style={{ width: '32px', height: '32px' }}><ZoomOut size={14} /></button>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="nav-item" style={{ width: '32px', height: '32px' }}><ZoomIn size={14} /></button>
          </div>
          <button onClick={handleSave} className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
            <Save size={18} /> EXPORT
          </button>
        </div>
      </header>

      {/* Editor Main Canvas */}
      <div ref={containerRef} style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
          <canvas ref={canvasRef} />
          <canvas 
            ref={drawCanvasRef} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ position: 'absolute', top: 0, left: 0, cursor: tool === 'draw' ? 'crosshair' : 'text' }}
          />
          {loading && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="fluid-bar" style={{ height: '40px' }} />
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <footer className="glass-pane" style={{ 
        margin: '1rem auto 2rem', 
        padding: '0.5rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '2rem',
        borderRadius: '14px'
      }}>
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="nav-item"
        >
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>PAGE {currentPage} OF {numPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
          disabled={currentPage === numPages}
          className="nav-item"
        >
          <ChevronRight size={20} />
        </button>
      </footer>
    </div>
  );
};

export default PDFEditor;
