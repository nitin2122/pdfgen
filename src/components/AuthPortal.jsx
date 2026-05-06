import React from 'react';
import { Shield, Zap, History, User, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthPortal = ({ onBack }) => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="auth-portal-container" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 5000, background: 'var(--bg-deep)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div className="app-bg" style={{ opacity: 0.6 }} />
      
      {/* Professional Navbar */}
      <nav style={{ 
        padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(30px)', 
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2, 6, 23, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={onBack}>
          <ArrowLeft size={20} color="var(--text-muted)" />
          <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.5px' }}>PDFGen <span style={{ color: 'var(--primary)' }}>PRO</span></span>
        </div>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
          Cancel
        </button>
      </nav>

      {/* Hero & Login Section - Re-architected for Vertical Flow */}
      <div className="auth-hero-section">
        <div className="auth-content-wrapper">
          
          {/* Top: Professional Value Proposition */}
          <div className="auth-hero-content">
            <div className="pro-badge">
              <Shield size={14} /> Professional Edition
            </div>
            <h1 className="auth-title">
              The Document Cloud <br/><span style={{ color: 'var(--primary)' }}>Built for Pros.</span>
            </h1>
            <p className="auth-subtitle">
              Sign in to harmonize your document workflow across all devices with enterprise-grade cloud syncing.
            </p>

            <div className="features-list">
              {[
                { icon: History, title: 'Cloud Sync', desc: 'Instant access to your history anywhere.' },
                { icon: Zap, title: 'Pro Engines', desc: 'High-fidelity DOCX & PPTX exports.' },
                { icon: Shield, title: 'Safe Harbor', desc: 'Your data is encrypted and private.' }
              ].map((item, idx) => (
                <div key={idx} className="feature-item">
                  <div className="feature-icon">
                    <item.icon size={18} />
                  </div>
                  <div className="feature-text">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer to force scroll on mobile */}
          <div className="auth-scroll-spacer" />

          {/* Bottom: Auth Interaction Card */}
          <div className="glass-pane auth-card">
            <div className="card-shine" />
            <div className="auth-card-icon">
              <User size={28} color="white" />
            </div>
            <h2 className="auth-card-title">Join the Suite</h2>
            <p className="auth-card-desc">Join 10k+ professionals streamlining their PDFs.</p>

            <button 
              onClick={handleLogin}
              className="btn-primary btn-touch google-login-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="privacy-badge">
              <div className="privacy-badge-content">
                <CheckCircle size={12} /> Data Privacy Active
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Professional Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.75rem', background: 'rgba(0,0,0,0.1)' }}>
        &copy; 2026 PDFGen Suite Pro. Enterprise Grade Identity Protection.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .auth-hero-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem;
        }

        .auth-content-wrapper {
          max-width: 1100px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 901px) {
          .auth-content-wrapper {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 4rem;
            align-items: center;
            margin: auto 0;
          }
          .auth-scroll-spacer { display: none; }
        }

        .pro-badge {
          display: inline-flex; align-items: center; gap: 0.5rem; 
          padding: 0.4rem 1rem; border-radius: 100px; 
          background: rgba(0, 112, 255, 0.1); border: 1px solid rgba(0, 112, 255, 0.2);
          color: var(--primary); font-size: 0.75rem; font-weight: 700; 
          margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px;
        }

        .auth-title { 
          font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; font-weight: 900; 
        }
        .auth-subtitle { 
          color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2.5rem; max-width: 450px; 
        }

        .features-list { display: flex; flex-direction: column; gap: 1.25rem; }
        
        .feature-item { display: flex; gap: 1rem; align-items: center; }
        .feature-icon {
          min-width: 42px; height: 42px; border-radius: 12px; 
          background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);
          display: flex; align-items: center; justify-content: center; color: var(--primary);
        }
        .feature-text h3 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.1rem; }
        .feature-text p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }

        .auth-scroll-spacer { height: 4vh; }

        .auth-card { 
          padding: 2.5rem; text-align: center; border: 1px solid var(--glass-border); 
          position: relative; overflow: hidden; 
          background: var(--glass-bg);
          backdrop-filter: blur(24px);
          border-radius: 24px;
        }
        .auth-card-icon {
          width: 56px; height: 56px; border-radius: 16px; background: var(--primary); 
          margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 8px 25px var(--primary-glow);
        }
        .auth-card-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-card-desc { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem; }

        .google-login-btn {
          width: 100%; background: white !important; color: black !important;
          font-weight: 800; font-size: 1rem; gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border: none;
          padding: 1rem;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          will-change: transform;
        }

        .google-login-btn:hover {
          transform: perspective(1000px) rotateX(8deg) translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(66, 133, 244, 0.2);
        }

        .google-login-btn:active {
          transform: perspective(1000px) rotateX(0deg) translateY(0) scale(0.96);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .feature-item { 
          display: flex; gap: 1rem; align-items: center; 
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .feature-item:hover {
          transform: translateX(8px);
        }
        .feature-icon {
          min-width: 42px; height: 42px; border-radius: 12px; 
          background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);
          display: flex; align-items: center; justify-content: center; color: var(--primary);
          transition: all 0.3s ease;
        }
        .feature-item:hover .feature-icon {
          background: var(--primary);
          color: white;
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 20px var(--primary-glow);
        }

        .privacy-badge {
          margin-top: 2rem; padding: 1rem; border-radius: 14px; 
          background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }
        .privacy-badge:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.05);
        }
        .privacy-badge-content {
          display: flex; align-items: center; justify-content: center; 
          gap: 0.4rem; color: var(--primary); font-size: 0.7rem; 
          font-weight: 800; text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .auth-hero-section { text-align: center; padding: 1.5rem 1rem; }
          .auth-hero-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
          .features-list { align-items: center; margin: 0 auto 1.5rem auto; width: 100%; max-width: 340px; }
          .auth-subtitle { margin-left: auto; margin-right: auto; padding: 0 0.5rem; }
          .feature-item { text-align: left; width: 100%; }
          .auth-card { width: 100% !important; max-width: 100%; margin: 0 auto 3rem auto !important; }
        }

        @media (max-width: 480px) {
          .auth-title { font-size: 1.75rem; margin-bottom: 1rem; padding: 0 0.25rem; }
          .auth-subtitle { font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.5; }
          .auth-card { padding: 1.75rem 1.25rem !important; border-radius: 20px; }
          .auth-scroll-spacer { height: 8vh; }
          .features-list { gap: 1rem !important; margin-bottom: 2rem; }
          .auth-hero-section { padding-top: 1rem; }
        }

        /* iPhone SE / Small Screen Optimization */
        @media (max-width: 375px) {
          .auth-title { font-size: 1.55rem; }
          .auth-subtitle { font-size: 0.8rem; margin-bottom: 1.25rem; }
          .feature-text h3 { font-size: 0.85rem; }
          .feature-text p { font-size: 0.75rem; }
          .auth-card { margin-bottom: 4rem; }
          .auth-scroll-spacer { height: 10vh; }
          .auth-card-title { font-size: 1.35rem; }
        }

        .card-shine {
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default AuthPortal;
