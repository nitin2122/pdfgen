import React from 'react';
import { Download, Printer, Save } from 'lucide-react';

const InvoicePreview = ({ invoice, subtotal, taxAmount, total, onPrint }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="sticky-preview animate-fade-in">
      {/* Actions */}
      <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          onClick={onPrint}
          style={{ 
            flex: 1,
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            padding: '12px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }}
        >
          <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      {/* Invoice Layout */}
      <div className="glass-card" id="invoice-preview" style={{ minHeight: '800px', padding: '3rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>INVOICE</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{invoice.details.number}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {invoice.business.name ? (
              <h2 style={{ fontSize: '1.25rem' }}>{invoice.business.name}</h2>
            ) : (
              <div style={{ color: 'var(--border)', fontStyle: 'italic' }}>Your Business Name</div>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{invoice.business.email}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '200px' }}>{invoice.business.address}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          <div>
            <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--primary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Bill To</h4>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{invoice.client.name || 'Client Name'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{invoice.client.email}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '200px' }}>{invoice.client.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>Date Issued</h4>
              <p style={{ fontWeight: 500 }}>{invoice.details.date}</p>
            </div>
            {invoice.details.dueDate && (
              <div>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>Due Date</h4>
                <p style={{ fontWeight: 500 }}>{invoice.details.dueDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--primary-light)' }}>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
              <th style={{ textAlign: 'center', padding: '12px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</th>
              <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 0', fontWeight: 500 }}>{item.description || 'Item Description'}</td>
                <td style={{ padding: '16px 0', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{formatCurrency(subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax ({invoice.taxRate}%)</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '2px solid var(--primary)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--primary)'
            }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div style={{ marginTop: '6rem' }}>
            <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--primary)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Notes & Terms</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
