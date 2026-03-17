import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout, isProvider, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const canManageProviderResources = isProvider || isAdmin;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const providerLinks = [
    { to: '/portfolio', icon: '📸', label: 'nav.portfolio' },
    { to: '/availability', icon: '📆', label: 'nav.availability' },
    { to: '/competences', icon: '🧠', label: 'nav.competences' },
    { to: '/certifications', icon: '🎓', label: 'nav.certifications' },
    { to: '/tracking', icon: '📍', label: 'nav.tracking' },
  ];

  const adminLinks = [
    { to: '/commissions', icon: '💰', label: 'nav.commissions' },
    { to: '/reviews', icon: '⭐', label: 'nav.reviews' },
    { to: '/transactions', icon: '💳', label: 'nav.transactions' },
    { to: '/packages', icon: '📦', label: 'nav.packages' },
    { to: '/notations', icon: '🧮', label: 'nav.notations' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>ServPro</h2>
        <p className="user-role">{user?.type ? t(`roles.${user.type}`) : ''}</p>
        <LanguageSwitcher />
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="icon">📊</span>
          {t('nav.dashboard')}
        </Link>

        <Link
          to="/services"
          className={`nav-item ${isActive('/services') ? 'active' : ''}`}
        >
          <span className="icon">🛠️</span>
          {t('nav.services')}
        </Link>

        <Link
          to="/bookings"
          className={`nav-item ${isActive('/bookings') ? 'active' : ''}`}
        >
          <span className="icon">📅</span>
          {t('nav.bookings')}
        </Link>

        <Link
          to="/offers"
          className={`nav-item ${isActive('/offers') ? 'active' : ''}`}
        >
          <span className="icon">🎁</span>
          {t('nav.offers')}
        </Link>

        {canManageProviderResources && providerLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {t(item.label)}
          </Link>
        ))}

        {isAdmin && adminLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {t(item.label)}
          </Link>
        ))}

        <Link
          to="/invoices"
          className={`nav-item ${isActive('/invoices') ? 'active' : ''}`}
        >
          <span className="icon">🧾</span>
          {t('nav.invoices')}
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
