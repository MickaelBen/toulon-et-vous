import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Server, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

/* ── Tokens brand la nouvelle marIAnne ── */
const BRAND = {
  navy:     '#1B2A6B',
  navyDark: '#0D1B4A',
  red:      '#E8192C',
  redDark:  '#C8151F',
  blueTint: '#F5F7FF',
  border:   '#D1D5DB',
  textMain: '#0D1B4A',
  textSub:  '#6B7280',
};

/* ── Logo texte marIAnne ── */
const LogoText = ({ light = false }) => (
  <span
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: '1.1rem',
      color: light ? '#FFFFFF' : BRAND.navy,
      letterSpacing: '-0.01em',
    }}
  >
    la nouvelle mar<span style={{ color: BRAND.red }}>IA</span>nne
  </span>
);

/* ── Google SVG ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

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

  const handleGoogle = () => {
    // TODO: Supabase Google OAuth
    toast.info('Connexion Google bientôt disponible');
  };

  /* ── Styles partagés ── */
  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '0.75rem',
    border: `1px solid ${BRAND.border}`,
    fontSize: '0.9375rem',
    color: BRAND.textMain,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 200ms, box-shadow 200ms',
    backgroundColor: '#FFFFFF',
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Helmet>
        <title>Connexion — Commune et Vous</title>
      </Helmet>

      {/* ══════════════════════════════════
          GAUCHE — Formulaire (blanc pur)
          mobile : en haut
      ══════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-14 md:py-0"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full"
          style={{ maxWidth: '380px' }}
        >
          {/* Logo (visible uniquement sur mobile en haut) */}
          <div className="mb-8 md:hidden">
            <LogoText />
          </div>

          {/* Titre */}
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '1.625rem',
              color: BRAND.textMain,
              marginBottom: '0.25rem',
            }}
          >
            Connexion
          </h1>
          <p style={{ color: BRAND.textSub, fontSize: '0.9rem', marginBottom: '2rem' }}>
            Bienvenue, content de vous revoir.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: BRAND.textMain, marginBottom: '0.4rem' }}>
                Email <span style={{ color: BRAND.red }}>*</span>
              </label>
              <input
                type="email"
                placeholder="exemple@commune.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND.navy;
                  e.target.style.boxShadow = `0 0 0 3px rgba(27,42,107,0.12)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = BRAND.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: BRAND.textMain, marginBottom: '0.4rem' }}>
                Mot de passe <span style={{ color: BRAND.red }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BRAND.navy;
                    e.target.style.boxShadow = `0 0 0 3px rgba(27,42,107,0.12)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BRAND.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', color: BRAND.textSub,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Mot de passe oublié */}
            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <button
                type="button"
                style={{ fontSize: '0.8125rem', color: BRAND.navy, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '0.75rem',
                backgroundColor: loading ? '#9CA3AF' : BRAND.navy,
                color: '#FFFFFF',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 200ms, transform 100ms',
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = BRAND.navyDark; }}
              onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = BRAND.navy; }}
              onMouseDown={(e) => { e.target.style.transform = 'scale(0.985)'; }}
              onMouseUp={(e) => { e.target.style.transform = 'scale(1)'; }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* Lien inscription */}
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: BRAND.textSub }}>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{ color: BRAND.red, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
              >
                S'inscrire
              </button>
            </p>

            {/* Séparateur */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: BRAND.border }} />
              <span style={{ fontSize: '0.8125rem', color: BRAND.textSub }}>ou</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: BRAND.border }} />
            </div>

            {/* Bouton Google */}
            <button
              type="button"
              onClick={handleGoogle}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${BRAND.border}`,
                color: BRAND.textMain,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND.blueTint; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              <GoogleIcon />
              Se connecter avec Google
            </button>

          </form>
        </motion.div>
      </div>

      {/* ══════════════════════════════════
          DROITE — Pitch (navy)
          mobile : en bas
      ══════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-14 md:py-0"
        style={{ backgroundColor: BRAND.navy }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="w-full text-center"
          style={{ maxWidth: '360px' }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <LogoText light />
          </div>

          {/* Icône mairie */}
          <div
            style={{
              width: '64px', height: '64px',
              borderRadius: '1rem',
              backgroundColor: BRAND.red,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 24px rgba(232,25,44,0.35)',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Titre produit */}
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#FFFFFF',
              marginBottom: '0.375rem',
            }}
          >
            Commune et Vous
          </h2>
          <p style={{ color: BRAND.red, fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            #ServicePublicDigital
          </p>

          {/* Description */}
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            Signalez un incident, suivez vos demandes et restez informé des actualités de votre commune — en quelques secondes.
          </p>

          {/* 3 badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {[
              { icon: <Shield size={18} />, label: 'RGPD', sub: 'Données protégées', color: '#10B981' },
              { icon: <Server size={18} />, label: 'France', sub: 'Hébergé ici', color: '#60A5FA' },
              { icon: <Mail size={18} />, label: 'Support', sub: 'Aide rapide', color: BRAND.red },
            ].map(({ icon, label, sub, color }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '0.625rem',
                  backgroundColor: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color,
                }}>
                  {icon}
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600 }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{sub}</span>
              </div>
            ))}
          </div>

          {/* Réassurance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'Aucune carte bancaire requise',
              'Inscription en quelques minutes',
              'Conforme RGPD',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem' }}>{item}</span>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
