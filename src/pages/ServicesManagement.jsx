import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import '../styles/Services.css';

const ServicesManagement = () => {
  const { t } = useTranslation();
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
    if (!window.confirm(t('services.confirmDelete'))) {
      return;
    }

    try {
      await apiService.delete(API_ENDPOINTS.SERVICE_BY_ID(id));
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert(t('common.error', { message: err.message }));
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('common.error', { message: error })}</div>;
  }

  return (
    <div className="services-management">
      <div className="page-header">
        <h1>{t('services.title')}</h1>
        <Link to="/services/new" className="btn-primary">
          + {t('services.new')}
        </Link>
      </div>

      <div className="services-table">
        <table>
          <thead>
            <tr>
              <th>{t('services.table.name')}</th>
              <th>{t('services.table.category')}</th>
              <th>{t('services.table.price')}</th>
              <th>{t('services.table.duration')}</th>
              <th>{t('services.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>{t(service.name)}</td>
                <td>
                  <span className="category-badge">{t(`services.categories.${service.category}`)}</span>
                </td>
                <td>{service.priceMin} {service.currency}</td>
                <td>{service.duration} min</td>
                <td className="actions">
                  <Link to={`/services/edit/${service._id}`} className="btn-edit">
                    {t('buttons.edit')}
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="btn-delete"
                  >
                    {t('buttons.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <p className="no-data">{t('services.noData')}</p>
        )}
      </div>
    </div>
  );
};

export default ServicesManagement;
