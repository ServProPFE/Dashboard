import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/Availability.css';

const dayLabels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const AvailabilityManagement = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    day: 1,
    start: '08:00',
    end: '17:00',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [user]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const providerId = user?._id || user?.id;
      const url = providerId
        ? `${API_ENDPOINTS.AVAILABILITY}?providerId=${providerId}`
        : API_ENDPOINTS.AVAILABILITY;
      const data = await apiService.get(url);
      const itemsArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setItems(itemsArray);
    } catch (err) {
      console.error('Error fetching availability:', err);
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
      await apiService.post(API_ENDPOINTS.AVAILABILITY, {
        day: Number(formData.day),
        start: formData.start,
        end: formData.end,
        provider: providerId,
      });

      setFormData({ day: 1, start: '08:00', end: '17:00' });
      fetchAvailability();
    } catch (err) {
      console.error('Error creating availability:', err);
      setError(err.message || 'Erreur lors de la creation');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette disponibilite ?')) {
      return;
    }

    try {
      await apiService.delete(API_ENDPOINTS.AVAILABILITY_BY_ID(id));
      fetchAvailability();
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des disponibilites...</div>;
  }

  return (
    <div className="availability-page">
      <div className="page-header">
        <h1>Disponibilite</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="availability-layout">
        <form className="availability-form" onSubmit={handleSubmit}>
          <h2>Ajouter une disponibilite</h2>
          <div className="form-group">
            <label htmlFor="day">Jour</label>
            <select id="day" name="day" value={formData.day} onChange={handleChange}>
              {dayLabels.map((label, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start">Debut</label>
              <input
                id="start"
                name="start"
                type="time"
                value={formData.start}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end">Fin</label>
              <input
                id="end"
                name="end"
                type="time"
                value={formData.end}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Ajouter'}
          </button>
        </form>

        <div className="availability-list">
          <h2>Mes creneaux</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Jour</th>
                  <th>Debut</th>
                  <th>Fin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((slot) => (
                  <tr key={slot._id}>
                    <td>{dayLabels[slot.day] || slot.day}</td>
                    <td>{slot.start}</td>
                    <td>{slot.end}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(slot._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="no-data">Aucun creneau trouve</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManagement;
