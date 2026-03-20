import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Connexion réussie');
      navigate('/accueil');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#1B2A6B' }}>
      <Helmet>
        <title>Connexion - Toulon & Vous</title>
        <meta name="description" content="Connectez-vous à votre compte Toulon & Vous" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Landmark className="text-white mx-auto mb-4" size={48} />
          <h1 className="text-white font-bold text-3xl mb-2">Connexion</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl py-3 px-4 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl py-3 px-4 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2563EB' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="text-center">
            <span className="text-white/60 text-sm">ou</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:bg-white/10 active:scale-98"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
            }}
          >
            Créer un compte
          </button>

          <button
            type="button"
            className="w-full text-white/70 text-sm hover:text-white transition-colors duration-200"
          >
            Mot de passe oublié ?
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;