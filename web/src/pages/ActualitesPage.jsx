import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav.jsx';
import supabase from '@/lib/supabaseClient.js';

const ActualitesPage = () => {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      const { data, error: sbError } = await supabase
        .from('actualites')
        .select('*')
        .order('published_at', { ascending: false });
      if (sbError) throw sbError;
      setActualites(data || []);
    } catch (error) {
      console.error('Error fetching actualites:', error);
      setActualites([
        {
          id: '1',
          titre: 'Le marché du Cours Lafayette fête ses 200 ans',
          categorie: 'Culture',
          published_at: '2026-03-18',
          image_url: 'https://images.unsplash.com/photo-1499586579817-95cd48cf3edc',
        },
        {
          id: '2',
          titre: 'Nouveaux aménagements cyclables sur la rade',
          categorie: 'Mobilité',
          published_at: '2026-03-15',
          image_url: 'https://images.unsplash.com/photo-1597235664211-36a50607ca94',
        },
        {
          id: '3',
          titre: 'Ouverture de la piscine municipale de Bon-Rencontre',
          categorie: 'Sport',
          published_at: '2026-03-10',
          image_url: 'https://images.unsplash.com/photo-1615332164186-fafa9acc796d',
        },
      ]);
    }
    setLoading(false);
  };

  const getCategoryColor = (categorie) => {
    switch (categorie) {
      case 'Culture': return '#8B5CF6';
      case 'Mobilité': return '#3B82F6';
      case 'Sport': return '#F59E0B';
      case 'Environnement': return '#16A34A';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getImageUrl = (actualite) => {
    if (actualite.image_url) return actualite.image_url;
    return 'https://images.unsplash.com/photo-1499586579817-95cd48cf3edc';
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#1B2A6B' }}>
      <Helmet>
        <title>Actualités - Toulon & Vous</title>
        <meta name="description" content="Les dernières actualités de la Ville de Toulon" />
      </Helmet>
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: '#0F1E5C' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4">
          <h1 className="text-white font-bold text-xl">Actualités</h1>
        </div>
      </div>
      <div className="max-w-[430px] mx-auto px-4 pt-20">
        {loading ? (
          <div className="text-white text-center py-12">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {actualites.map((actualite, index) => (
              <motion.div
                key={actualite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-98"
                style={{ background: 'rgba(255, 255, 255, 0.08)' }}
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${getImageUrl(actualite)})` }}
                />
                <div className="p-4">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white mb-2"
                    style={{ backgroundColor: getCategoryColor(actualite.categorie) }}
                  >
                    {actualite.categorie}
                  </span>
                  <h2 className="text-white font-bold text-lg mb-2 leading-tight">
                    {actualite.titre}
                  </h2>
                  <p className="text-white/60 text-sm">{formatDate(actualite.published_at)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ActualitesPage;
