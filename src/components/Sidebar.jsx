import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout, isProvider, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>ServPro</h2>
        <p className="user-role">{user?.type}</p>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="icon">📊</span>
          Dashboard
        </Link>

        <Link
          to="/services"
          className={`nav-item ${isActive('/services') ? 'active' : ''}`}
        >
          <span className="icon">🛠️</span>
          Services
        </Link>

        <Link
          to="/bookings"
          className={`nav-item ${isActive('/bookings') ? 'active' : ''}`}
        >
          <span className="icon">📅</span>
          Réservations
        </Link>

        <Link
          to="/offers"
          className={`nav-item ${isActive('/offers') ? 'active' : ''}`}
        >
          <span className="icon">🎁</span>
          Offres
        </Link>

        {isProvider && (
          <>
            <Link
              to="/portfolio"
              className={`nav-item ${isActive('/portfolio') ? 'active' : ''}`}
            >
              <span className="icon">📸</span>
              Portfolio
            </Link>

            <Link
              to="/availability"
              className={`nav-item ${isActive('/availability') ? 'active' : ''}`}
            >
              <span className="icon">📆</span>
              Disponibilité
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link
              to="/commissions"
              className={`nav-item ${isActive('/commissions') ? 'active' : ''}`}
            >
              <span className="icon">💰</span>
              Commissions
            </Link>

            <Link
              to="/reviews"
              className={`nav-item ${isActive('/reviews') ? 'active' : ''}`}
            >
              <span className="icon">⭐</span>
              Avis
            </Link>
          </>
        )}

        <Link
          to="/invoices"
          className={`nav-item ${isActive('/invoices') ? 'active' : ''}`}
        >
          <span className="icon">🧾</span>
          Factures
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
