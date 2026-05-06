import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  setDoc
} from 'firebase/firestore';

const initialData = {
  business: {
    name: '',
    email: '',
    address: '',
    phone: '',
    logo: null,
  },
  client: {
    name: '',
    email: '',
    address: '',
    phone: '',
  },
  details: {
    number: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
  },
  items: [
    { id: '1', description: '', quantity: 1, price: 0 },
  ],
  taxRate: 0,
  notes: '',
};

export const useInvoice = (user) => {
  const [invoice, setInvoice] = useState(initialData);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync with Firestore
  useEffect(() => {
    if (!user) {
      setSavedInvoices([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'invoices'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setSavedInvoices(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateBusiness = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      business: { ...prev.business, [field]: value }
    }));
  };

  const updateClient = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const updateDetails = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      details: { ...prev.details, [field]: value }
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]
    }));
  };

  const updateItem = (id, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (id) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateTaxRate = (rate) => {
    setInvoice(prev => ({ ...prev, taxRate: parseFloat(rate) || 0 }));
  };

  const updateNotes = (notes) => {
    setInvoice(prev => ({ ...prev, notes }));
  };

  const saveCurrentInvoice = async () => {
    if (!user) return;

    try {
      const dataToSave = {
        ...invoice,
        total: total,
        timestamp: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'users', user.uid, 'invoices'), dataToSave);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const loadInvoice = (savedInv) => {
    setInvoice(savedInv);
  };

  const deleteSavedInvoice = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'invoices', id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const loadInvoiceData = (data) => {
    if (data && typeof data === 'object') {
      setInvoice({
        ...initialData,
        ...data,
        items: data.items || initialData.items
      });
    }
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount;

  const resetInvoice = () => setInvoice(initialData);

  return {
    invoice,
    savedInvoices,
    loading,
    updateBusiness,
    updateClient,
    updateDetails,
    addItem,
    updateItem,
    removeItem,
    updateTaxRate,
    updateNotes,
    subtotal,
    taxAmount,
    total,
    resetInvoice,
    saveCurrentInvoice,
    loadInvoice,
    deleteSavedInvoice,
    loadInvoiceData,
  };
};
