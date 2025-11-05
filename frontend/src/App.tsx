import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
// import ApartmentsPage from './pages/ApartmentsPage';
// import ApartmentDetailPage from './pages/ApartmentDetailPage';
// import BookingsPage from './pages/BookingsPage';
// import ProfilePage from './pages/ProfilePage';

// Components
import { Navbar } from './components/Navbar';

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/apartments" element={<ApartmentsPage />} /> */}
          {/* <Route path="/apartments/:id" element={<ApartmentDetailPage />} /> */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
          />
          {/* <Route
            path="/bookings"
            element={isAuthenticated ? <BookingsPage /> : <Navigate to="/login" />}
          /> */}
          {/* <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;