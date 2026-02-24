import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import '../styles/Commissions.css';

const CommissionsManagement = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    fetchCommissions();
  }, []);

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
    </div>
  );
};

export default CommissionsManagement;
