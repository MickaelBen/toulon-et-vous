import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav.jsx';
import supabase from '@/lib/supabaseClient';
import APP_CONFIG from '@/config/app.js';

const DEMO_DATA = {
  '1': {
    id: '1',
    titre: 'Le marché du Cours Lafayette fête ses 200 ans',
    categorie: 'Culture',
    date: '2026-03-18',
    image_url: 'https://images.unsplash.com/photo-1499586579817-95cd48cf3edc',
    content: 'Le célèbre marché du Cours Lafayette, emblème de la vie toulonnaise, célèbre cette année son bicentenaire. Depuis 1826, ce marché provençal accueille chaque matin producteurs locaux, artisans et habitants qui viennent s\'approvisionner en fruits, légumes, fromages et spécialités régionales.\n\nPour fêter cet anniversaire exceptionnel, la Ville organise plusieurs événements : dégustations gratuites, animations musicales, et une exposition photographique retraçant deux siècles d\'histoire du marché.\n\nLes festivités se dérouleront tout au long du mois de mars et d\'avril.',
  },
  '2': {
    id: '2',
    titre: 'Nouveaux aménagements cyclables sur la rade',
    categorie: 'Mobilité',
    date: '2026-03-15',
    image_url: 'https://images.unsplash.com/photo-1597235664211-36a50607ca94',
    content: 'La Ville de Toulon inaugure de nouveaux aménagements cyclables le long de la rade. Ce projet de 3,2 km de pistes sécurisées relie désormais le centre-ville au port de commerce, offrant une alternative douce et agréable aux automobilistes.\n\nCes aménagements s\'inscrivent dans le plan vélo municipal 2025-2030, qui prévoit 45 km de nouvelles voies cyclables d\'ici la fin de la décennie.\n\nLes travaux ont mobilisé une enveloppe de 2,4 millions d\'euros, cofinancée par l\'État et la Région.',
  },
  '3': {
    id: '3',
    titre: 'Ouverture de la piscine municipale de Bon-Rencontre',
    categorie: 'Sport',
    date: '2026-03-10',
    image_url: 'https://images.unsplash.com/photo-1615332164186-fafa9acc796d',
    content: 'Après 18 mois de travaux de rénovation, la piscine municipale de Bon-Rencontre ouvre à nouveau ses portes. Entièrement réhabilitée, elle dispose désormais d\'un bassin olympique de 50 mètres, d\'un espace aquatique ludique et d\'une zone bien-être avec sauna et hammam.\n\nLes créneaux d\'accès au public sont disponibles en ligne sur le portail citoyen. Des abonnements familiaux à tarif préférentiel sont proposés pour les résidents de la commune.\n\nL\'ouverture est fixée au samedi 10 mars à 9h.',
  },
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
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const ActualiteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActualite();
  }, [id]);

  const fetchActualite = async () => {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setActualite(data);
    } catch {
      // Fallback demo data
      setActualite(DEMO_DATA[id] || null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div style={{ color: 'var(--text-sub)' }}>Chargement...</div>
      </div>
    );
  }

  if (!actualite) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div style={{ color: 'var(--text-main)' }}>Article introuvable</div>
      </div>
    );
  }

  const imageUrl = actualite.image_url || actualite.image || 'https://images.unsplash.com/photo-1499586579817-95cd48cf3edc';
  const dateStr = actualite.published_at || actualite.date;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Helmet>
        <title>{actualite.titre} - {APP_CONFIG.appName}</title>
      </Helmet>

      {/* Header fixe */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[430px] mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} style={{ color: 'var(--text-main)' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg truncate" style={{ color: 'var(--text-main)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Actualités
          </h1>
        </div>
      </div>

      {/* Image hero */}
      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-[430px] mx-auto px-4 py-6"
      >
        {/* Badge catégorie */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-3"
          style={{ backgroundColor: getCategoryColor(actualite.categorie) }}
        >
          {actualite.categorie}
        </span>

        {/* Titre */}
        <h2
          className="font-bold text-2xl leading-tight mb-2"
          style={{ color: 'var(--text-main)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {actualite.titre}
        </h2>

        {/* Date */}
        {dateStr && (
          <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>
            {formatDate(dateStr)}
          </p>
        )}

        {/* Séparateur */}
        <div className="mb-6" style={{ height: '1px', backgroundColor: 'var(--border)' }} />

        {/* Corps de l'article */}
        <div
          className="text-base leading-relaxed space-y-4"
          style={{ color: 'var(--text-main)' }}
        >
          {(actualite.content || actualite.description || actualite.titre)
            .split('\n\n')
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default ActualiteDetailPage;
