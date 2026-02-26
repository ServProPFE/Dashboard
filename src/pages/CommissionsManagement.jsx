import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/Commissions.css';

const CommissionsManagement = () => {
  const { isAdmin } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCommission, setTotalCommission] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    percentage: '',
    amount: '',
    booking: '',
  });

  useEffect(() => {
    fetchCommissions();
    if (isAdmin) {
      fetchBookings().then(bookingsArray => setBookings(bookingsArray));
    }
  }, [isAdmin]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(API_ENDPOINTS.COMMISSIONS);
      const commissionsArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setCommissions(commissionsArray);
      
      // Calculate total commissions
      const total = commissionsArray.reduce((sum, c) => sum + (c.amount || 0), 0);
      setTotalCommission(total);
    } catch (err) {
      console.error('Error fetching commissions:', err);
      setError(err.message);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKINGS);
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

  const handleCreateCommission = async (e) => {
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
        percentage: Number(formData.percentage),
        amount: Number(formData.amount),
        booking: formData.booking,
      };

      await apiService.post(API_ENDPOINTS.COMMISSIONS, payload);
      setFormData({ percentage: '', amount: '', booking: '' });
      setShowCreateModal(false);
      fetchCommissions();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des commissions...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="commissions-management">
      <div className="page-header">
        <h1>Gestion des Commissions</h1>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Nouvelle Commission
          </button>
        )}
      </div>

      <div className="commissions-summary">
        <div className="summary-card">
          <h3>Commission Totale</h3>
          <p className="amount">{totalCommission.toFixed(2)} TND</p>
        </div>
        <div className="summary-card">
          <h3>Nombre de Commissions</h3>
          <p className="count">{commissions.length}</p>
        </div>
      </div>

      <div className="commissions-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Réservation</th>
              <th>Fournisseur</th>
              <th>Montant</th>
              <th>Pourcentage</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map(commission => (
              <tr key={commission._id}>
                <td>{commission._id.substring(0, 8)}...</td>
                <td>{commission.booking?.client?.name || 'N/A'}</td>
                <td>{commission.booking?.provider?.name || 'N/A'}</td>
                <td>{commission.amount || 0} TND</td>
                <td>{commission.percentage || 0}%</td>
                <td>{new Date(commission.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {commissions.length === 0 && (
          <p className="no-data">Aucune commission trouvée</p>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouvelle Commission</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCreateCommission}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="booking">Réservation *</label>
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
                <label htmlFor="percentage">Pourcentage *</label>
                <input
                  id="percentage"
                  name="percentage"
                  type="number"
                  value={formData.percentage}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Ex: 15"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Montant *</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Ex: 150"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionsManagement;
