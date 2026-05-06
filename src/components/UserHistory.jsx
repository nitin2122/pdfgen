import React, { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Clock, 
  FileText, 
  Trash2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const UserHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteRecord = async (id) => {
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="glass-pane" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Synchronizing with Cloud Ledger...</p>
      </div>
    );
  }

  return (
    <div className="history-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {history.length === 0 ? (
        <div className="glass-pane" style={{ textAlign: 'center', padding: '4rem' }}>
          <FileText size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No records found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Processed documents will appear here when you are signed in.</p>
        </div>
      ) : (
        history.map((item) => (
          <div key={item.id} className="glass-pane" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--glass-border)',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ 
                width: '45px', height: '45px', borderRadius: '12px', 
                background: 'rgba(0, 112, 255, 0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.fileName}
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    borderRadius: '20px', 
                    background: 'rgba(255,255,255,0.05)', 
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {item.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={12} /> {new Date(item.timestamp?.toDate()).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => deleteRecord(item.id)}
                style={{ 
                  background: 'none', border: 'none', color: '#ef4444', 
                  padding: '8px', cursor: 'pointer', opacity: 0.6,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                onMouseOut={(e) => e.currentTarget.style.opacity = 0.6}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserHistory;
