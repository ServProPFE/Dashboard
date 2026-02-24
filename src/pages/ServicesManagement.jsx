import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import '../styles/Services.css';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(API_ENDPOINTS.SERVICES);
      // Backend returns { items: [...] }
      const servicesArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setServices(servicesArray);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      await apiService.delete(API_ENDPOINTS.SERVICE_BY_ID(id));
      fetchServices();
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des services...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="services-management">
      <div className="page-header">
        <h1>Gestion des Services</h1>
        <Link to="/services/new" className="btn-primary">
          + Nouveau Service
        </Link>
      </div>

      <div className="services-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Durée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>
                  <span className="category-badge">{service.category}</span>
                </td>
                <td>{service.priceMin} {service.currency}</td>
                <td>{service.duration} min</td>
                <td className="actions">
                  <Link to={`/services/edit/${service._id}`} className="btn-edit">
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="btn-delete"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <p className="no-data">Aucun service trouvé</p>
        )}
      </div>
    </div>
  );
};

export default ServicesManagement;
