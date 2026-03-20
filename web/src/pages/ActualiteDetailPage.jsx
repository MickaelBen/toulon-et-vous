import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabaseClient.js';
import BottomNav from '@/components/BottomNav.jsx';

const ActualiteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('actualites').select('*').eq('id', id).single();
      setActualite(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const getCategoryColor = (cat) => {
    const map = { Culture: '#8B5CF6', 'Mobilit\u00e9': '#3B82F6', Sport: '#F59E0B', Environnement: '#16A34A' };
    return map[cat] || '#6B7280';
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1B2A6B' }}>
      <div className="text-white">Chargement...</div>
    </div>
  );

  if (!actualite) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1B2A6B' }}>
      <div className="text-white">Article introuvable</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1B2A6B' }}>
      <Helmet><title>{actualite.titre} - Toulon & Vous</title></Helmet>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: '#0F1E5C' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-xl truncate">Actualit\u00e9s</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[430px] mx-auto pt-20"
      >
        {/* Image */}
        {actualite.image_url && (
          <div
            className="h-52 bg-cover bg-center"
            style={{ backgroundImage: `url(${actualite.image_url})` }}
          />
        )}

        <div className="px-4 pt-5 space-y-4">
          {/* Badge + date */}
          <div className="flex items-center gap-3">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getCategoryColor(actualite.categorie) }}
            >
              {actualite.categorie}
            </span>
            <span className="text-white/50 text-sm">{formatDate(actualite.published_at)}</span>
          </div>

          {/* Titre */}
          <h2 className="text-white font-bold text-2xl leading-tight">{actualite.titre}</h2>

          {/* Contenu */}
          <p className="text-white/80 text-base leading-relaxed">{actualite.contenu}</p>

          {/* Bouton retour bas */}
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-98 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft size={18} /> Retour aux actualit\u00e9s
          </button>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default ActualiteDetailPage;
