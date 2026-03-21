import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { User, Sun, Moon } from 'lucide-react';
import APP_CONFIG from '@/config/app.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import ServiceTile from '@/components/ServiceTile.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import BottomNav from '@/components/BottomNav.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const services = [
    { icon: 'MapPin', label: 'Mon quartier', color: '#F97316' },
    { icon: 'Leaf', label: 'Environnement', color: '#16A34A' },
    { icon: 'FileText', label: 'Mes déclarations', color: '#3B82F6' },
    { icon: 'Inbox', label: 'Mes demandes', color: '#8B5CF6' },
    {
      icon: 'AlertTriangle',
      label: 'Signaler un problème',
      color: '#EF4444',
      subtitle: 'Voirie, éclairage, propreté...',
      large: true,
      onClick: () => navigate('/signaler'),
    },
    { icon: 'Calendar', label: 'Réunions publiques', color: '#F59E0B' },
    { icon: 'HeartPulse', label: 'Où me soigner', color: '#EC4899' },
    { icon: 'Newspaper', label: 'Actualités', color: '#06B6D4', onClick: () => navigate('/actualites') },
    { icon: 'Landmark', label: 'Ma ville', color: '#6366F1' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Helmet>
        <title>Accueil - {APP_CONFIG.appName}</title>
        <meta name="description" content={APP_CONFIG.description} />
      </Helmet>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-main)' }}>{APP_CONFIG.appName}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
              style={{ border: '2px solid var(--border)' }}
            >
              {isDark ? <Sun size={18} style={{ color: 'var(--text-main)' }} /> : <Moon size={18} style={{ color: 'var(--text-main)' }} />}
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
              style={{ border: '2px solid var(--border)' }}
            >
              <User style={{ color: 'var(--text-main)' }} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[430px] mx-auto px-4 pt-20">
        <div className="mb-6">
          <SearchBar placeholder="Rechercher un service..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {services.map((service, index) => (
            <ServiceTile
              key={index}
              icon={service.icon}
              label={service.label}
              color={service.color}
              subtitle={service.subtitle}
              large={service.large}
              onClick={service.onClick}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;