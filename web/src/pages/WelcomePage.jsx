import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import APP_CONFIG from '@/config/app.js';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#1B2A6B' }}>
      <Helmet>
        <title>Bienvenue - {APP_CONFIG.appName}</title>
        <meta name="description" content={APP_CONFIG.description} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-8">
          <Landmark className="text-white mx-auto mb-6" size={64} />
          <h1 className="text-white font-bold text-4xl mb-3" style={{ letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {APP_CONFIG.appName}
          </h1>
          <p className="text-white/70 text-lg">Le portail citoyen de {APP_CONFIG.commune}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/accueil')}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98"
            style={{ backgroundColor: '#E8192C' }}
          >
            Commencer
          </button>

          <button
            onClick={() => navigate('/login')}
            className="text-white/80 text-sm hover:text-white transition-colors duration-200"
          >
            J'ai déjà un compte → Se connecter
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;