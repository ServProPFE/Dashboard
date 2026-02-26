import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, isProvider, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const bookingsData = await apiService.get(API_ENDPOINTS.BOOKINGS);
      const servicesData = await apiService.get(API_ENDPOINTS.SERVICES);

      // Backend returns { items: [...] }
      const bookingsArray = Array.isArray(bookingsData.items) ? bookingsData.items : (Array.isArray(bookingsData) ? bookingsData : []);
      const servicesArray = Array.isArray(servicesData.items) ? servicesData.items : (Array.isArray(servicesData) ? servicesData : []);

      // Calculate stats
      const totalBookings = bookingsArray.length;
      const pendingBookings = bookingsArray.filter(b => b.status === 'PENDING').length;
      const totalRevenue = bookingsArray
        .filter(b => b.status === 'DONE')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        totalBookings,
        pendingBookings,
        totalServices: servicesArray.length,
        totalRevenue,
      });

      // Get recent bookings
      const recent = bookingsArray
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.welcome', { name: user?.name })}</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title={t('dashboard.stats.totalBookings')}
          value={stats.totalBookings}
          icon="📊"
          color="blue"
        />
        <StatsCard
          title={t('dashboard.stats.pending')}
          value={stats.pendingBookings}
          icon="⏳"
          color="yellow"
        />
        <StatsCard
          title={t('dashboard.stats.services')}
          value={stats.totalServices}
          icon="🛠️"
          color="purple"
        />
        <StatsCard
          title={t('dashboard.stats.revenue')}
          value={`${stats.totalRevenue} TND`}
          icon="💰"
          color="green"
        />
      </div>

      <div className="recent-bookings">
        <h2>{t('dashboard.recentTitle')}</h2>
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>{t('dashboard.table.service')}</th>
                <th>{t('dashboard.table.client')}</th>
                <th>{t('dashboard.table.date')}</th>
                <th>{t('dashboard.table.status')}</th>
                <th>{t('dashboard.table.price')}</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.service?.name || 'N/A'}</td>
                  <td>{booking.client?.name || 'N/A'}</td>
                  <td>{new Date(booking.expectedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {t(`bookings.filters.${booking.status}`)}
                    </span>
                  </td>
                  <td>{booking.totalPrice} {booking.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBookings.length === 0 && (
            <p className="no-data">{t('dashboard.noRecent')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
