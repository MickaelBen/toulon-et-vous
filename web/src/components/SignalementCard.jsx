import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import pb from '@/lib/pocketbaseClient';

const SignalementCard = ({ signalement }) => {
  const navigate = useNavigate();

  const getCategoryColor = (categorie) => {
    switch (categorie) {
      case 'Voirie':
        return '#EF4444';
      case 'Éclairage':
        return '#F59E0B';
      case 'Espaces verts':
        return '#16A34A';
      case 'Propreté':
        return '#8B5CF6';
      case 'Mobilier urbain':
        return '#F97316';
      default:
        return '#6B7280';
    }
  };

  const photoUrl = signalement.photo
    ? pb.files.getUrl(signalement, signalement.photo, { thumb: '100x100' })
    : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <motion.button
      onClick={() => navigate(`/signalement/${signalement.id}`)}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200"
      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
    >
      <div className="flex gap-3">
        {photoUrl && (
          <div
            className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${photoUrl})` }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getCategoryColor(signalement.categorie) }}
            >
              {signalement.categorie}
            </span>
            <StatusBadge status={signalement.statut || 'Nouveau'} small />
          </div>
          <p className="text-white text-sm font-medium line-clamp-2 mb-1">
            {signalement.description}
          </p>
          <p className="text-white/60 text-xs">{formatDate(signalement.created)}</p>
        </div>
      </div>
    </motion.button>
  );
};

export default SignalementCard;