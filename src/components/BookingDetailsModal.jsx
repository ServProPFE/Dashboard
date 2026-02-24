import '../styles/BookingDetailsModal.css';

const BookingDetailsModal = ({ booking, onClose, onUpdate }) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Détails de la Réservation</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Information du Service</h3>
            <div className="detail-row">
              <span className="label">Service:</span>
              <span className="value">{booking.service?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Catégorie:</span>
              <span className="value">{booking.service?.category || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Information du Client</h3>
            <div className="detail-row">
              <span className="label">Nom:</span>
              <span className="value">{booking.client?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{booking.client?.email || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Téléphone:</span>
              <span className="value">{booking.client?.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Détails de la Réservation</h3>
            <div className="detail-row">
              <span className="label">Date prévue:</span>
              <span className="value">
                {new Date(booking.expectedAt).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Statut:</span>
              <span className={`status-badge ${booking.status}`}>
                {booking.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Prix total:</span>
              <span className="value price">
                {booking.totalPrice} {booking.currency}
              </span>
            </div>
            {booking.detail?.address && (
              <div className="detail-row">
                <span className="label">Adresse:</span>
                <span className="value">{booking.detail.address}</span>
              </div>
            )}
            {booking.detail?.notes && (
              <div className="detail-row">
                <span className="label">Notes:</span>
                <span className="value">{booking.detail.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
