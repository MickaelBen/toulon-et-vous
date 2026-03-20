import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SignalementPage from './pages/SignalementPage.jsx';
import MesSignalementsPage from './pages/MesSignalementsPage.jsx';
import SignalementDetailPage from './pages/SignalementDetailPage.jsx';
import ActualitesPage from './pages/ActualitesPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/accueil"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signaler"
            element={
              <ProtectedRoute>
                <SignalementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-signalements"
            element={
              <ProtectedRoute>
                <MesSignalementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signalement/:id"
            element={
              <ProtectedRoute>
                <SignalementDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/actualites" element={<ActualitesPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;