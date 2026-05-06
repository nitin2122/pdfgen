import React from 'react';
import { 
  Box, 
  Layers, 
  Activity, 
  Settings, 
  ChevronRight,
  X,
  Zap,
  Shield,
  Target,
  LogOut,
  User,
  History as HistoryIcon
} from 'lucide-react';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import PDFTools from './components/PDFTools';
import UserHistory from './components/UserHistory';
import AuthPortal from './components/AuthPortal';

function App() {
  const [showSettings, setShowSettings] = React.useState(false);
  const [compressionLevel, setCompressionLevel] = React.useState('medium');
  const [user, setUser] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('dashboard'); // dashboard, history, auth

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && activeTab === 'auth') {
        setActiveTab('dashboard');
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const handleLoginView = () => setActiveTab('auth');

  const handleLogout = () => signOut(auth);

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="app-bg" />

      {/* Responsive Navigation */}
      <nav className="sidebar-nav no-print">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <Box size={22} />
        </button>
        
        {user && (
          <button 
            onClick={() => setActiveTab('history')} 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            <HistoryIcon size={22} />
          </button>
        )}

        <div style={{ flex: 1 }} />

        <button 
          onClick={() => setShowSettings(true)} 
          className={`nav-item ${showSettings ? 'active' : ''}`}
        >
          <Settings size={22} />
        </button>

        {/* Dynamic User/Login Section - Perfectly Aligned for Mobile */}
        <div className="user-nav-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} 
                alt="User" 
                onClick={handleLogout}
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  border: '2px solid var(--primary)', cursor: 'pointer',
                  boxShadow: '0 0 15px var(--primary-glow)'
                }} 
              />
            </div>
          ) : (
            <button 
              onClick={handleLoginView} 
              className={`nav-item ${activeTab === 'auth' ? 'active' : ''}`} 
              title="Sign In"
            >
              <User size={22} />
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-container">
        <header style={{ marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <h1 style={{ marginBottom: '0.25rem' }}>PDFGen</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {activeTab === 'dashboard' ? 'Utility Workspace' : 'Document History'} <ChevronRight size={14} /> Systems Active
          </p>
        </header>

        {activeTab === 'dashboard' && <PDFTools compressionLevel={compressionLevel} user={user} />}
        {activeTab === 'history' && <UserHistory user={user} />}
      </main>

      {/* Auth Portal View */}
      {activeTab === 'auth' && <AuthPortal onBack={() => setActiveTab('dashboard')} />}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(2, 6, 23, 0.95)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-pane" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', position: 'relative' }}>
            <button 
              onClick={() => setShowSettings(false)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={24} color="var(--primary)" /> Settings
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Global configuration for document processing.</p>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Compression Quality</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'low', label: 'Higher Quality', sub: 'Less compression, sharp visuals', icon: Shield },
                  { id: 'medium', label: 'Medium Quality', sub: 'Balanced size and clarity', icon: Target },
                  { id: 'high', label: 'Higher Compression', sub: 'Low quality, smallest file size', icon: Zap }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setCompressionLevel(opt.id)}
                    style={{
                      background: compressionLevel === opt.id ? 'rgba(0, 112, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${compressionLevel === opt.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                      padding: '1.25rem',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: compressionLevel === opt.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: compressionLevel === opt.id ? 'white' : 'var(--text-muted)'
                    }}>
                      <opt.icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.sub}</div>
                    </div>
                    {compressionLevel === opt.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
