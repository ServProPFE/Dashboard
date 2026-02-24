import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import '../styles/ServiceForm.css';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: 'PLOMBERIE',
    priceMin: '',
    duration: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['PLOMBERIE', 'ELECTRICITE', 'CLIMATISATION', 'NETTOYAGE', 'AUTRE'];

  useEffect(() => {
    if (isEdit) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const data = await apiService.get(API_ENDPOINTS.SERVICE_BY_ID(id));
      setFormData({
        name: data.name,
        category: data.category,
        priceMin: data.priceMin,
        duration: data.duration,
        description: data.description || '',
      });
    } catch (err) {
      setError('Erreur lors du chargement du service');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await apiService.put(API_ENDPOINTS.SERVICE_BY_ID(id), formData);
      } else {
        // Add provider ID for new service
        const serviceData = {
          ...formData,
          provider: user._id || user.id,
        };
        await apiService.post(API_ENDPOINTS.SERVICES, serviceData);
      }
      navigate('/services');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Modifier le Service' : 'Nouveau Service'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label htmlFor="name">Nom du service *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: Installation climatisation"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priceMin">Prix minimum (TND) *</label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              value={formData.priceMin}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Durée (minutes) *</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Description détaillée du service..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
