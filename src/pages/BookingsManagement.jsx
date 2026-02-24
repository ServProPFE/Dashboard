import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import BookingDetailsModal from '../components/BookingDetailsModal';
import '../styles/Bookings.css';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(API_ENDPOINTS.BOOKINGS);
      // Backend returns { items: [...] }
      const bookingsArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setBookings(bookingsArray);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (filter === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === filter));
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await apiService.patch(`${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}/status`, {
        status: newStatus,
      });
      fetchBookings();
    } catch (err) {
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des réservations...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="bookings-management">
      <div className="page-header">
        <h1>Gestion des Réservations</h1>
      </div>

      <div className="status-filters">
        {statuses.map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'Toutes' : status}
            <span className="count">
              {status === 'ALL'
                ? bookings.length
                : bookings.filter(b => b.status === status).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Client</th>
              <th>Date</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking._id.substring(0, 8)}...</td>
                <td>{booking.service?.name || 'N/A'}</td>
                <td>{booking.client?.name || 'N/A'}</td>
                <td>{new Date(booking.expectedAt).toLocaleString()}</td>
                <td>{booking.totalPrice} {booking.currency}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className={`status-select ${booking.status}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="actions">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="btn-view"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <p className="no-data">Aucune réservation trouvée</p>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  );
};

export default BookingsManagement;
