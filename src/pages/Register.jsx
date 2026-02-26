import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: 'PROVIDER',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.errors.passwordLength'));
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register({
        ...registrationData,
        passwordHash: registrationData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || t('auth.errors.register'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>ServPro Dashboard</h1>
          <p>{t('auth.registerSubtitle')}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">{t('auth.accountType')}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="PROVIDER">{t('auth.provider')}</option>
              <option value="ADMIN">{t('auth.admin')}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">{t('auth.name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('auth.namePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('auth.emailPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t('auth.phone')}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={t('auth.phonePlaceholder')}
            />
          </div>

          {formData.type === 'PROVIDER' && (
            <>
              <div className="form-group">
                <label htmlFor="businessName">{t('auth.businessName')}</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder={t('auth.businessNamePlaceholder')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('auth.address')}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('auth.addressPlaceholder')}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.registerLoading') : t('auth.registerButton')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t('auth.haveAccount')}{' '}
            <Link to="/login">{t('auth.loginLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
