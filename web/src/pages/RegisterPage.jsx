import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import APP_CONFIG from '@/config/app.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    adresse: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signup(
      formData.prenom,
      formData.nom,
      formData.email,
      formData.password,
      formData.adresse
    );

    if (result.success) {
      toast.success('Compte créé avec succès');
      navigate('/accueil');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: '#F5F7FF' }}>
      <Helmet>
        <title>Créer un compte - {APP_CONFIG.appName}</title>
        <meta name="description" content={`Créez votre compte ${APP_CONFIG.appName}`} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Landmark className="mx-auto mb-4" style={{ color: '#1B2A6B' }} size={48} />
          <h1 className="font-bold text-3xl mb-2" style={{ color: '#0D1B4A' }}>Créer mon compte</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                color: '#0D1B4A',
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                color: '#0D1B4A',
              }}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                color: '#0D1B4A',
              }}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                color: '#0D1B4A',
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="adresse"
              placeholder="Adresse (optionnel)"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full rounded-xl py-3 px-4 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                color: '#0D1B4A',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#E8192C' }}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          <p className="text-xs text-center mt-4" style={{ color: '#6B7280' }}>
            En créant un compte, vous acceptez les conditions générales d'utilisation
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;