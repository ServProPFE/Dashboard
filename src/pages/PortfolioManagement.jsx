import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/Portfolio.css';

const PortfolioManagement = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const providerId = user?._id || user?.id;
      const url = providerId
        ? `${API_ENDPOINTS.PORTFOLIOS}?providerId=${providerId}`
        : API_ENDPOINTS.PORTFOLIOS;
      const data = await apiService.get(url);
      const itemsArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setItems(itemsArray);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
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
    setError(null);
    setSaving(true);

    try {
      const providerId = user?._id || user?.id;
      const imagesArray = formData.images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

      await apiService.post(API_ENDPOINTS.PORTFOLIOS, {
        title: formData.title,
        description: formData.description,
        images: imagesArray,
        provider: providerId,
      });

      setFormData({ title: '', description: '', images: '' });
      fetchPortfolios();
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError(err.message || 'Erreur lors de la creation du portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce portfolio ?')) {
      return;
    }

    try {
      await apiService.delete(API_ENDPOINTS.PORTFOLIO_BY_ID(id));
      fetchPortfolios();
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Chargement du portfolio...</div>;
  }

  return (
    <div className="portfolio-page">
      <div className="page-header">
        <h1>Portfolio</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="portfolio-layout">
        <form className="portfolio-form" onSubmit={handleSubmit}>
          <h2>Nouveau projet</h2>
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Installation cuisine"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Resume du travail realise..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Images (URLs separees par virgule)</label>
            <textarea
              id="images"
              name="images"
              rows="3"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://... , https://..."
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Ajouter'}
          </button>
        </form>

        <div className="portfolio-list">
          <h2>Mes projets</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.description || '-'}</td>
                    <td>{item.images?.length || 0}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="no-data">Aucun projet trouve</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManagement;
