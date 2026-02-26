import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/Invoices.css';

const InvoicesManagement = () => {
  const { isAdmin } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    total: '',
    issuedAt: '',
    booking: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchBookings().then(bookingsArray => setBookings(bookingsArray));
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(API_ENDPOINTS.INVOICES);
      // Backend returns { items: [...] }
      const invoicesArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setInvoices(invoicesArray);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKINGS);
        // Backend returns { items: [...] }
        const bookingsArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
        return bookingsArray;
    } catch (err) {
      console.error('Error fetching bookings:', err);
      return [];
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!formData.booking) {
      setError('Veuillez sélectionner une réservation');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        number: formData.number,
        total: Number(formData.total),
        booking: formData.booking,
      };

      if (formData.issuedAt) {
        payload.issuedAt = formData.issuedAt;
      }

      await apiService.post(API_ENDPOINTS.INVOICES, payload);
      setFormData({ number: '', total: '', issuedAt: '', booking: '' });
      setShowCreateModal(false);
      fetchInvoices();
    } catch (err) {
      setError(err.message || 'Erreur lors de la creation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des factures...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="invoices-management">
      <div className="page-header">
        <h1>Gestion des Factures</h1>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Nouvelle Facture
          </button>
        )}
      </div>

      <div className="invoices-table">
        <table>
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Service</th>
              <th>Montant</th>
              <th>Date d'émission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice._id}>
                <td>{invoice.number || invoice._id.substring(0, 8)}</td>
                <td>{invoice.booking ? (invoice.booking.client?.name || 'Client inconnu') : '⚠️ Pas de réservation'}</td>
                <td>{invoice.booking ? (invoice.booking.service?.name || 'Service inconnu') : '⚠️ Pas de réservation'}</td>
                <td>{invoice.total} TND</td>
                <td>{new Date(invoice.issuedAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="btn-view">Voir</button>
                  <button className="btn-download">Télécharger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <p className="no-data">Aucune facture trouvée</p>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouvelle facture</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCreateInvoice}>
              <div className="form-group">
                <label htmlFor="number">Numero *</label>
                <input
                  id="number"
                  name="number"
                  type="text"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="total">Montant *</label>
                <input
                  id="total"
                  name="total"
                  type="number"
                  value={formData.total}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking">Reservation *</label>
                <select
                  id="booking"
                  name="booking"
                  value={formData.booking}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une réservation</option>
                  {bookings.map(booking => (
                    <option key={booking._id} value={booking._id}>
                      {booking.client?.name || 'Client'} - {booking.service?.name || 'Service'} ({booking._id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="issuedAt">Date d'emission</label>
                <input
                  id="issuedAt"
                  name="issuedAt"
                  type="date"
                  value={formData.issuedAt}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Creer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesManagement;
