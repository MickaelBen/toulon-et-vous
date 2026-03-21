import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, FileText, Newspaper } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/accueil', icon: Home, label: 'Accueil' },
    { path: '/signaler', icon: AlertTriangle, label: 'Signaler' },
    { path: '/mes-signalements', icon: FileText, label: 'Mes signalements' },
    { path: '/actualites', icon: Newspaper, label: 'Actualités' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: '#0F1E5C',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-[430px] mx-auto">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center py-2 px-1 transition-all duration-200"
                style={{
                  color: isActive ? '#E8192C' : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <Icon size={22} />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;