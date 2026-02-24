import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import '../styles/Offers.css';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(API_ENDPOINTS.OFFERS);
      // Backend returns { items: [...] }
      const offersArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setOffers(offersArray);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err.message);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await apiService.put(API_ENDPOINTS.OFFER_BY_ID(editingOffer._id), formData);
      } else {
        await apiService.post(API_ENDPOINTS.OFFERS, formData);
      }
      resetForm();
      fetchOffers();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      validUntil: offer.validUntil.substring(0, 10),
      isActive: offer.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    try {
      await apiService.delete(API_ENDPOINTS.OFFER_BY_ID(id));
      fetchOffers();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      validUntil: '',
      isActive: true,
    });
    setEditingOffer(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Chargement des offres...</div>;
  }

  return (
    <div className="offers-management">
      <div className="page-header">
        <h1>Gestion des Offres</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Nouvelle Offre
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingOffer ? 'Modifier l\'Offre' : 'Nouvelle Offre'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titre *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discount">Réduction (%) *</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="basePrice">Prix de base (optionnel)</label>
                <input
                  type="number"
                    id="basePrice"
                    name="basePrice"
                    value={formData.basePrice || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Prix avant réduction"
                />
              </div>

              <div className="form-group">
                <label htmlFor="validUntil">Valide jusqu'au *</label>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Offre active
              </label>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="offers-table">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Reduction</th>
              <th>Prix de base</th>
              <th>Valide jusqu'au</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer._id}>
                <td>{offer.title}</td>
                <td>{offer.description || '-'}</td>
                <td>{offer.discount}%</td>
                <td>{offer.basePrice ?? '-'}</td>
                <td>{new Date(offer.validUntil).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${offer.isActive ? 'active' : 'inactive'}`}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => handleEdit(offer)} className="btn-edit">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(offer._id)} className="btn-delete">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {offers.length === 0 && <p className="no-data">Aucune offre</p>}
      </div>
    </div>
  );
};

export default OffersManagement;
