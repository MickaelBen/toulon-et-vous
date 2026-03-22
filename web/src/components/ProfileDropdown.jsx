import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bell, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const ref = useRef(null);

  // Fermer au clic en dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/');
  };

  const prenom = currentUser?.user_metadata?.prenom || '';
  const nom = currentUser?.user_metadata?.nom || '';
  const email = currentUser?.email || '';
  const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || '?';
  const nomComplet = prenom || nom ? `${prenom} ${nom}`.trim() : email;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="absolute top-14 right-4 z-50 w-72 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* En-tête — identité */}
          <div className="px-4 py-4 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: '#1B2A6B' }}
            >
              {initiales}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-main)' }}>
                {nomComplet}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-sub)' }}>
                {email}
              </p>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

          {/* Toggle thème */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
            style={{ color: 'var(--text-main)' }}
          >
            <div className="flex items-center gap-3">
              {isDark
                ? <Sun size={18} style={{ color: '#F59E0B' }} />
                : <Moon size={18} style={{ color: '#6366F1' }} />
              }
              <span className="text-sm font-medium">
                {isDark ? 'Mode clair' : 'Mode sombre'}
              </span>
            </div>
            {/* Mini toggle pill */}
            <div
              className="w-10 h-5 rounded-full relative transition-colors duration-200"
              style={{ backgroundColor: isDark ? '#1B2A6B' : '#E5E7EB' }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: isDark ? '22px' : '2px' }}
              />
            </div>
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

          {/* Actions secondaires */}
          <button
            onClick={() => { onClose(); toast.info('Notifications — bientôt disponible'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50"
            style={{ color: 'var(--text-main)' }}
          >
            <Bell size={18} style={{ color: 'var(--text-sub)' }} />
            <span className="font-medium">Notifications</span>
          </button>

          <button
            onClick={() => { onClose(); toast.info('Confidentialité — bientôt disponible'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50"
            style={{ color: 'var(--text-main)' }}
          >
            <Lock size={18} style={{ color: 'var(--text-sub)' }} />
            <span className="font-medium">Confidentialité</span>
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors hover:bg-red-50"
            style={{ color: '#E8192C' }}
          >
            <LogOut size={18} />
            <span>Se déconnecter</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
