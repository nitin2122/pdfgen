import React from 'react';
import { Plus, Trash2, Building2, User, FileText, Settings } from 'lucide-react';

const InvoiceForm = ({ 
  invoice, 
  updateBusiness, 
  updateClient, 
  updateDetails, 
  addItem, 
  updateItem, 
  removeItem,
  updateTaxRate,
  updateNotes
}) => {
  return (
    <div className="glass-card no-print animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={24} color="var(--primary)" />
        Invoice Details
      </h2>

      {/* Business Details */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Building2 size={18} />
          Your Business
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input 
            placeholder="Business Name" 
            value={invoice.business.name}
            onChange={(e) => updateBusiness('name', e.target.value)}
          />
          <input 
            placeholder="Email Address" 
            value={invoice.business.email}
            onChange={(e) => updateBusiness('email', e.target.value)}
          />
          <input 
            placeholder="Address" 
            style={{ gridColumn: 'span 2' }}
            value={invoice.business.address}
            onChange={(e) => updateBusiness('address', e.target.value)}
          />
        </div>
      </section>

      {/* Client Details */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <User size={18} />
          Bill To
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input 
            placeholder="Client Name" 
            value={invoice.client.name}
            onChange={(e) => updateClient('name', e.target.value)}
          />
          <input 
            placeholder="Client Email" 
            value={invoice.client.email}
            onChange={(e) => updateClient('email', e.target.value)}
          />
          <input 
            placeholder="Client Address" 
            style={{ gridColumn: 'span 2' }}
            value={invoice.client.address}
            onChange={(e) => updateClient('address', e.target.value)}
          />
        </div>
      </section>

      {/* Invoice Meta */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Settings size={18} />
          Meta Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Invoice #</label>
            <input 
              value={invoice.details.number}
              onChange={(e) => updateDetails('number', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date</label>
            <input 
              type="date"
              value={invoice.details.date}
              onChange={(e) => updateDetails('date', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due Date</label>
            <input 
              type="date"
              value={invoice.details.dueDate}
              onChange={(e) => updateDetails('dueDate', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <FileText size={18} />
            Services/Items
          </h3>
          <button 
            onClick={addItem}
            style={{ 
              background: 'var(--primary-light)', 
              color: 'var(--primary)', 
              border: 'none', 
              padding: '6px 12px', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 500
            }}
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {invoice.items.map((item) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'start' }}>
            <input 
              placeholder="Description" 
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Qty" 
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            />
            <input 
              type="number" 
              placeholder="Price" 
              value={item.price}
              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
            />
            <button 
              onClick={() => removeItem(item.id)}
              style={{ 
                background: 'transparent', 
                color: 'var(--danger)', 
                border: 'none', 
                padding: '10px',
                borderRadius: '8px'
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </section>

      {/* Tax & Notes */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tax Rate (%)</label>
          <input 
            type="number"
            value={invoice.taxRate}
            onChange={(e) => updateTaxRate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Additional Notes</label>
          <textarea 
            rows="1"
            placeholder="Bank details, terms, etc."
            value={invoice.notes}
            onChange={(e) => updateNotes(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>
      </section>
    </div>
  );
};

export default InvoiceForm;
