import { useTranslation } from 'react-i18next';
import '../styles/BookingDetailsModal.css';

const BookingDetailsModal = ({ booking, onClose, onUpdate }) => {
  const { t } = useTranslation();
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('bookings.details.title')}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>{t('bookings.details.serviceInfo')}</h3>
            <div className="detail-row">
              <span className="label">{t('bookings.details.service')}:</span>
              <span className="value">{booking.service?.name ? t(booking.service.name) : 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('bookings.details.category')}:</span>
              <span className="value">{booking.service?.category ? t(`services.categories.${booking.service.category}`) : 'N/A'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>{t('bookings.details.clientInfo')}</h3>
            <div className="detail-row">
              <span className="label">{t('bookings.details.name')}:</span>
              <span className="value">{booking.client?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('bookings.details.email')}:</span>
              <span className="value">{booking.client?.email || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('bookings.details.phone')}:</span>
              <span className="value">{booking.client?.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>{t('bookings.details.bookingInfo')}</h3>
            <div className="detail-row">
              <span className="label">{t('bookings.details.expectedAt')}:</span>
              <span className="value">
                {new Date(booking.expectedAt).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">{t('bookings.details.status')}:</span>
              <span className={`status-badge ${booking.status}`}>
                {booking.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">{t('bookings.details.totalPrice')}:</span>
              <span className="value price">
                {booking.totalPrice} {booking.currency}
              </span>
            </div>
            {booking.detail?.address && (
              <div className="detail-row">
                <span className="label">{t('bookings.details.address')}:</span>
                <span className="value">{booking.detail.address}</span>
              </div>
            )}
            {booking.detail?.notes && (
              <div className="detail-row">
                <span className="label">{t('bookings.details.notes')}:</span>
                <span className="value">{booking.detail.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            {t('buttons.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
