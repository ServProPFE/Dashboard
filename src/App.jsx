import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ServicesManagement from './pages/ServicesManagement';
import ServiceForm from './pages/ServiceForm';
import BookingsManagement from './pages/BookingsManagement';
import OffersManagement from './pages/OffersManagement';
import InvoicesManagement from './pages/InvoicesManagement';
import PortfolioManagement from './pages/PortfolioManagement';
import AvailabilityManagement from './pages/AvailabilityManagement';
import ReviewsManagement from './pages/ReviewsManagement';
import CommissionsManagement from './pages/CommissionsManagement';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isArabic = i18n.language?.startsWith('ar');
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/services" element={<ServicesManagement />} />
                      <Route path="/services/new" element={<ServiceForm />} />
                      <Route path="/services/edit/:id" element={<ServiceForm />} />
                      <Route path="/bookings" element={<BookingsManagement />} />
                      <Route path="/offers" element={<OffersManagement />} />
                      <Route path="/portfolio" element={<PortfolioManagement />} />
                      <Route path="/availability" element={<AvailabilityManagement />} />
                      <Route path="/invoices" element={<InvoicesManagement />} />
                      <Route path="/reviews" element={<ReviewsManagement />} />
                      <Route path="/commissions" element={<CommissionsManagement />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
